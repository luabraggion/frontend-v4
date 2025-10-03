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
  /** cor de fundo do botão de girar */
  spinButtonColor?: string;
  /** cor do texto do botão de girar */
  spinButtonTextColor?: string;
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
  className = 'flex flex-col gap-4 items-center w-max',
  durationMs = 7000,
  spins = 5,
  textOrientation = 'vertical',
  onFinish,
  spinButtonLabel = 'Girar',
  spinButtonSpinningLabel = 'Girando…',
  showSpinButton = true,
  externalSpinRef,
  spinButtonColor,
  spinButtonTextColor,
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
      const isVerticalText = textOrientation === 'vertical';
      if (isVerticalText) textAngle += Math.PI / 2;
      ctx.rotate(textAngle);

      // dimensionamento da fonte e quebra de linha inteligente
      const maxWidth = radius * 0.8;
      const baseFontPx = Math.round(13 * dpr);
      const fontPx = baseFontPx; // Mantém fonte fixa, sem redução
      ctx.font = `${fontPx}px Gordita, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = String(options[i].label ?? '');
      const measured = ctx.measureText(label).width;

      const words = label.split(' ');
      let lines: string[] = [];

      // No modo vertical, SEMPRE tentar quebrar em duas linhas se houver mais de uma palavra
      // No modo horizontal, só quebrar se não couber
      const shouldTryBreak = isVerticalText
        ? words.length > 1
        : measured > maxWidth && words.length > 1;

      if (shouldTryBreak) {
        let line1 = '';
        let line2 = '';
        let foundBreak = false;

        // Tenta distribuir palavras entre duas linhas
        for (let w = 0; w < words.length; w++) {
          const testLine1 = line1 ? line1 + ' ' + words[w] : words[w];
          const testLine2 = words.slice(w + 1).join(' ');

          const width1 = ctx.measureText(testLine1).width;
          const width2 = ctx.measureText(testLine2).width;

          if (width1 <= maxWidth && width2 <= maxWidth) {
            line1 = testLine1;
            line2 = testLine2;
            foundBreak = true;
            break;
          }
        }

        if (foundBreak && line1 && line2) {
          lines = [line1, line2];
        }
      }

      // Se não conseguiu quebrar ou não deve quebrar, verificar se precisa truncar
      if (lines.length === 0) {
        if (measured > maxWidth) {
          // Aplicar truncamento
          let drawLabel = label;
          while (drawLabel.length > 1 && ctx.measureText(drawLabel + '…').width > maxWidth) {
            drawLabel = drawLabel.slice(0, -1);
          }
          lines = [drawLabel + '…'];
        } else {
          // Cabe em uma linha
          lines = [label];
        }
      }

      // Desenhar as linhas
      const lineHeight = fontPx * 1.2;
      const totalHeight = lines.length * lineHeight;

      if (lines.length > 1) {
        // Múltiplas linhas: sempre empilha verticalmente, mesmo no modo vertical
        const startY = -(totalHeight / 2) + lineHeight / 2;

        lines.forEach((line, idx) => {
          ctx.fillText(line, 0, startY + idx * lineHeight);
        });
      } else {
        // Uma linha apenas
        ctx.fillText(lines[0], 0, 0);
      }
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
    ctx.fillStyle = '#FFFFFF';
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
        <button
          onClick={() => startSpin()}
          disabled={isSpinning}
          style={{
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            backgroundColor: spinButtonColor || undefined,
            color: spinButtonTextColor || undefined,
            borderColor: spinButtonColor || undefined,
          }}
          aria-pressed={isSpinning}
          className="px-8 py-2 hover:opacity-90 transition-opacity hover:cursor-pointer rounded-lg"
        >
          {isSpinning ? spinButtonSpinningLabel : spinButtonLabel}
        </button>
      )}
    </div>
  );
};

export { Wheel };
export default Wheel;
