import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface WheelOption {
  label: string;
  color?: string; // cor sólida (sem degradê)
}

export interface WheelProps {
  options: WheelOption[];
  size?: number; // px
  className?: string;
  /** duração da animação em milissegundos (padrão 7000) */
  durationMs?: number;
  /** número de voltas completas antes de parar (padrão 5) */
  spins?: number;
  /** se 'vertical', rotaciona os textos 90 graus */
  textOrientation?: 'horizontal' | 'vertical';
  /** callback chamado ao finalizar o giro com a opção vencedora */
  onFinish?: (opt: WheelOption) => void;
  /** texto do botão de girar */
  spinButtonLabel?: string;
  /** texto do botão enquanto está girando */
  spinButtonSpinningLabel?: string;
  /** exibe o botão de girar (padrão: true) */
  showSpinButton?: boolean;
  /** permite passar função para girar a roleta externamente */
  externalSpinRef?: React.Ref<(opts?: { forceIndex?: number }) => void>;
}

const defaultColors = [
  '#ff914d',
  '#e45d56',
  '#bb2f5d',
  '#87095e',
  '#4b0056',
  '#4e3d8f',
  '#3f6ec1',
  '#1b9ee6',
];

// easing in/out cúbico (entrada/saída suave)
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Roleta canvas-based, pré-renderiza a face em um canvas offscreen e anima a rotação via rAF */
const Wheel: React.FC<WheelProps> = ({
  options,
  size = 340,
  className = '',
  durationMs = 7000,
  spins = 5,
  textOrientation = 'vertical',
  onFinish,
  spinButtonLabel = 'Girar',
  spinButtonSpinningLabel = 'Girando…',
  showSpinButton = true,
  externalSpinRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0); // rotação atual em radianos

  const n = options?.length ?? 0;
  // verificação defensiva
  useEffect(() => {
    if (!options || options.length === 0) return;
  }, [options]);

  // preparar prerender em canvas offscreen quando options ou size mudarem
  useEffect(() => {
    if (!options || options.length === 0) return;
    const dpr = Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    const off = document.createElement('canvas');
    const ctx = off.getContext('2d');
    if (!ctx) return;
    const px = size * dpr;
    off.width = px;
    off.height = px;
    const cx = px / 2;
    const cy = px / 2;
    const radius = px / 2;

    const segment = (Math.PI * 2) / n;

    // desenhar fatias
    for (let i = 0; i < n; i++) {
      const start = i * segment;
      const end = start + segment;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = options[i].color ?? defaultColors[i % defaultColors.length];
      ctx.fill();
      // traço para separar levemente as fatias
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = Math.max(1, Math.round(dpr));
      ctx.stroke();

      // rótulo
      const mid = start + segment / 2;
      // raio do texto dinâmico para evitar corte quando há muitas fatias
      const textRadiusBase = radius * (n > 8 ? 0.42 : 0.52);
      const textRadius = textRadiusBase;
      ctx.save();
      ctx.translate(cx + Math.cos(mid) * textRadius, cy + Math.sin(mid) * textRadius);
      // rotaciona o texto para ficar legível; se 'vertical', rotaciona 90°
      let textAngle = mid + Math.PI / 2; // deixar na posição legível
      if (textOrientation === 'vertical') textAngle += Math.PI / 2;
      ctx.rotate(textAngle);

      // dimensionamento da fonte e truncamento
      const maxWidth = radius * 0.8;
      const baseFontPx = Math.round(13 * dpr);
      let fontPx = baseFontPx;
      ctx.font = `${fontPx}px Gordita, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = String(options[i].label ?? '');
      let measured = ctx.measureText(label).width;
      while (measured > maxWidth && fontPx > 9 * dpr) {
        fontPx -= 1 * dpr;
        ctx.font = `${fontPx}px Gordita, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto`;
        measured = ctx.measureText(label).width;
      }
      let drawLabel = label;
      if (measured > maxWidth) {
        // truncamento simples com reticências
        while (drawLabel.length > 1 && ctx.measureText(drawLabel + '…').width > maxWidth) {
          drawLabel = drawLabel.slice(0, -1);
        }
        drawLabel = drawLabel + '…';
      }
      ctx.fillText(drawLabel, 0, 0);
      ctx.restore();
    }

    offscreenRef.current = off;

    // desenhar visual inicial no canvas principal
    const canvas = canvasRef.current;
    if (canvas && off) {
      const cctx = canvas.getContext('2d');
      if (cctx) {
        const w = size * dpr;
        const h = w;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        cctx.clearRect(0, 0, w, h);
        cctx.drawImage(off, 0, 0);
      }
    }
    // sem necessidade de limpeza aqui
  }, [options, size, textOrientation, n]);

  // loop de desenho: usa rotationRef e o canvas offscreen
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offscreenRef.current;
    if (!canvas || !off) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2);
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // centrar + aplicar rotação
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rotationRef.current);
    ctx.translate(-w / 2, -h / 2);
    ctx.drawImage(off, 0, 0, w, h);
    ctx.restore();

    // desenhar ponteiro no topo (levemente elevado)
    const pointerSize = Math.max(15 * dpr, 15);
    // elevar o ponteiro reduzindo a coordenada Y do topo e aproximando a ponta
    const pointerY = 0;
    const pointerTip = pointerSize * 1.5;
    ctx.fillStyle = '#f6f3f4';
    ctx.beginPath();
    ctx.moveTo(w / 2 - pointerSize, pointerY);
    ctx.lineTo(w / 2 + pointerSize, pointerY);
    ctx.lineTo(w / 2, pointerTip);
    ctx.closePath();
    ctx.fill();
  }, []);

  // animar para um índice aleatório (apenas uma execução por clique)
  const startSpin = useCallback(
    (opts?: { forceIndex?: number }) => {
      if (isSpinning || n === 0) return;
      setIsSpinning(true);
      // pick random index ou forçado
      const chosen =
        typeof opts?.forceIndex === 'number' && opts.forceIndex >= 0 && opts.forceIndex < n
          ? opts.forceIndex
          : Math.floor(Math.random() * n);
      const segment = (Math.PI * 2) / n;
      // calcular alvo para que o centro da fatia escolhida fique em -Math.PI/2 (ponteiro superior)
      const chosenCenter = chosen * segment + segment / 2;
      // rotação atual normalizada
      const current = rotationRef.current % (Math.PI * 2);
      // rotação alvo (positivo => horário). Queremos a rotação final igual a spins*2π mais o offset necessário para alinhar chosenCenter ao topo.
      // Em prática: align = -π/2 - chosenCenter. Somamos spins positivos para garantir sentido horário.
      const align = -Math.PI / 2 - chosenCenter;
      const base = spins * Math.PI * 2 + align;
      const startTime = performance.now();
      startRef.current = startTime;
      const duration = Math.max(300, durationMs);

      const from = current;
      const to = base;

      const step = (now: number) => {
        if (!startRef.current) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOut(t);
        rotationRef.current = from + (to - from) * eased;
        draw();
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // fim da animação
          setIsSpinning(false);
          // normalizar rotação para [0,2π)
          rotationRef.current =
            ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          draw();
          // chamar onFinish com a opção vencedora (se fornecido)
          try {
            onFinish?.(options[chosen]);
          } catch {
            // ignorar erros no callback
          }
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [draw, durationMs, isSpinning, n, options, onFinish, spins],
  );

  // permite controle externo do giro
  React.useImperativeHandle(externalSpinRef, () => startSpin, [startSpin]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  if (!options || options.length === 0) {
    return <div className={className}>Nenhuma opção</div>;
  }

  return (
    <div className={className} style={{ width: size }}>
      <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '50%' }} />
      {showSpinButton && (
        <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
          <button
            onClick={() => startSpin()}
            disabled={isSpinning}
            style={{ flex: 1, padding: '10px 6px', cursor: isSpinning ? 'not-allowed' : 'pointer' }}
            aria-pressed={isSpinning}
            className="text-gray-800 font-semibold"
          >
            {isSpinning ? spinButtonSpinningLabel : spinButtonLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export { Wheel };
export default Wheel;
