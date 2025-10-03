import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '@/styles/ColorPicker.css';
import React, { useEffect, useRef, useState } from 'react';

interface ColorPickerFixedProps {
  /** Quantidade fixa de cores (default: 12) */
  count?: number;
  /** Cores iniciais; serão normalizadas para o tamanho `count` */
  defaultColors?: string[];
  /** Dispara quando a lista final de cores é salva/atualizada */
  onChange?: (colors: string[]) => void;
  /** Rótulo opcional acima do seletor */
  label?: string;
}

// Paleta fallback para preencher cores ausentes
const DEFAULT_PALETTE = [
  '#F97316',
  '#FACC15',
  '#8B5CF6',
  '#4338CA',
  '#FF5733',
  '#33FF57',
  '#5733FF',
  '#FF33A8',
  '#33A8FF',
  '#FFA833',
  '#A833FF',
  '#33FFA8',
];

// Converter HEX para HSL (usado para posicionar o slider pelo hue)
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  if (!hex) return { h: 0, s: 0, l: 0 };
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Converter HSL para HEX (usado pelo slider)
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  if (s === 0) {
    const val = Math.round(l * 255);
    return `#${val.toString(16).padStart(2, '0').repeat(3)}`;
  }
  function hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hueToRgb(p, q, h / 360 + 1 / 3);
  const g = hueToRgb(p, q, h / 360);
  const b = hueToRgb(p, q, h / 360 - 1 / 3);
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function normalizeColors(source: string[] | undefined, count: number): string[] {
  const base = (source && source.length > 0 ? source : DEFAULT_PALETTE).slice(0, count);
  if (base.length < count) {
    const needed = count - base.length;
    const filler: string[] = [];
    for (let i = 0; i < needed; i++) {
      filler.push(DEFAULT_PALETTE[(base.length + i) % DEFAULT_PALETTE.length]);
    }
    return [...base, ...filler];
  }
  return base;
}

export const ColorPickerFixed: React.FC<ColorPickerFixedProps> = ({
  count = 12,
  defaultColors,
  onChange,
  label = 'Cores da roleta',
}) => {
  const [colors, setColors] = useState<string[]>(() => normalizeColors(defaultColors, count));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(colors[0] ?? '#4F46E5');
  const [hueValue, setHueValue] = useState<number>(() => hexToHSL(currentColor).h);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Sincroniza quando props mudarem
  useEffect(() => {
    const normalized = normalizeColors(defaultColors, count);
    setColors((prev) => {
      // Evita recriar se já está consistente
      if (prev.length === normalized.length && prev.every((c, i) => c === normalized[i])) {
        return prev;
      }
      return normalized;
    });
  }, [defaultColors, count]);

  // Atualiza slider quando currentColor mudar
  useEffect(() => {
    const { h } = hexToHSL(currentColor);
    setHueValue(h);
    if (sliderRef.current) sliderRef.current.value = h.toString();
  }, [currentColor]);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setCurrentColor(colors[index]);
  };

  const handleColorInput = (hex: string) => {
    setCurrentColor(hex);
    if (editingIndex !== null) {
      const next = [...colors];
      next[editingIndex] = hex;
      setColors(next);
    }
  };

  const save = () => {
    if (editingIndex !== null) {
      onChange?.(colors);
      setEditingIndex(null);
    }
  };

  const cancel = () => {
    if (editingIndex !== null) {
      // Reverte a cor atual para a que está no array
      setCurrentColor(colors[editingIndex]);
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-gray-500">
          {label} — Clique em uma cor para editar. Não é possível adicionar ou excluir.
        </p>
        <p className="text-xs text-muted-foreground">{colors.length} cores (fixo)</p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <div
                    style={{ backgroundColor: color }}
                    className="w-10 h-10 rounded-full cursor-pointer border shadow-sm hover:scale-110 transition-transform"
                    onClick={() => startEditing(index)}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar cor {index + 1}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div
        className={`bg-white p-4 rounded-lg shadow-md border ${
          editingIndex !== null ? 'border-info ring-2 ring-info/30' : ''
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">
            {editingIndex !== null ? `Editando cor ${editingIndex + 1}` : 'Selecione uma cor acima'}
          </label>
          <div className="text-xs text-gray-500">{count} cores</div>
        </div>

        {/* Caixa de visualização/acionamento do seletor nativo */}
        <div
          className="w-full h-24 rounded-lg border cursor-pointer transition-all hover:shadow-md relative group"
          style={{ backgroundColor: currentColor }}
          onClick={(e) => {
            if (editingIndex === null) return;
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = currentColor;
            colorInput.style.position = 'absolute';
            colorInput.style.left = `${e.clientX + window.scrollX}px`;
            colorInput.style.top = `${e.clientY + window.scrollY}px`;
            colorInput.style.width = '24px';
            colorInput.style.height = '24px';
            colorInput.style.opacity = '0';
            colorInput.style.padding = '0';
            colorInput.style.border = 'none';
            colorInput.style.cursor = 'pointer';
            document.body.appendChild(colorInput);

            const handleInput = (ev: Event) => {
              const target = ev.target as HTMLInputElement;
              handleColorInput(target.value);
            };
            const cleanup = () => {
              colorInput.removeEventListener('input', handleInput);
              colorInput.removeEventListener('change', cleanup);
              colorInput.removeEventListener('blur', cleanup);
              if (document.body.contains(colorInput)) document.body.removeChild(colorInput);
            };

            colorInput.addEventListener('input', handleInput);
            colorInput.addEventListener('change', cleanup);
            colorInput.addEventListener('blur', cleanup);

            colorInput.click();
          }}
        >
          <div className="absolute inset-0 bg-opacity-0 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
            <span className="text-white opacity-0 group-hover:opacity-100 font-medium transition-opacity px-2 py-1 rounded bg-black bg-opacity-40 text-center">
              Clique para escolher uma cor
            </span>
          </div>
        </div>

        {/* Slider de Hue + input color auxiliar */}
        <div className="flex items-center gap-x-2 h-10 mt-3">
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max="360"
            value={hueValue}
            className="color-slider flex-1"
            style={{
              background:
                'linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)',
            }}
            onChange={(e) => {
              const hue = parseInt(e.target.value);
              setHueValue(hue);
              const hex = hslToHex(hue, 100, 50);
              handleColorInput(hex);
            }}
            disabled={editingIndex === null}
          />
          <div className="relative flex items-center self-center w-10">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorInput(e.target.value)}
              className="cursor-pointer rounded-lg overflow-hidden"
              style={{ padding: 0, backgroundColor: 'transparent' }}
              disabled={editingIndex === null}
            />
            <div
              className="absolute inset-0 pointer-events-none rounded border border-white top-1/2 -translate-y-1/2 h-8 w-12"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="text-sm">
            <span className="text-gray-500">Hex:</span> {currentColor}
          </div>
          <div className="space-x-2">
            <button
              onClick={cancel}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
              disabled={editingIndex === null}
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="px-3 py-1 text-sm bg-info text-info-foreground rounded-md hover:bg-info/90 disabled:opacity-60"
              disabled={editingIndex === null}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerFixed;
