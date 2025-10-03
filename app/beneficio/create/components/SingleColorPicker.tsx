import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '@/styles/ColorPicker.css';
import React, { useEffect, useRef, useState } from 'react';

interface SingleColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
  label?: string;
}

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

/**
 * Componente para seleção de uma única cor
 * Ideal para personalizar elementos como botões, textos, etc.
 */
export const SingleColorPicker: React.FC<SingleColorPickerProps> = ({
  defaultColor = '#FFFFFF',
  onChange,
  label = 'Escolha sua cor favorita',
}) => {
  // Estado para armazenar a cor selecionada
  const [color, setColor] = useState<string>(defaultColor);
  const [hueValue, setHueValue] = useState<number>(() => hexToHSL(defaultColor).h);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Referência para o input de cor e slider
  const colorInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Sincroniza quando defaultColor mudar externamente
  useEffect(() => {
    setColor(defaultColor);
    const { h } = hexToHSL(defaultColor);
    setHueValue(h);
    if (sliderRef.current) sliderRef.current.value = h.toString();
  }, [defaultColor]);

  // Atualiza slider quando color mudar
  useEffect(() => {
    const { h } = hexToHSL(color);
    setHueValue(h);
    if (sliderRef.current) sliderRef.current.value = h.toString();
  }, [color]);

  // Função para lidar com a mudança de cor
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{label}</p>
      </div>

      {/* Visualização da cor selecionada */}
      <div className="flex items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                style={{ backgroundColor: color }}
                className="w-10 h-10 rounded-full cursor-pointer border shadow-sm hover:scale-110 transition-transform"
                onClick={() => {
                  setIsEditing(true);
                  colorInputRef.current?.click();
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para editar a cor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm font-medium">{color}</span>
      </div>

      {/* Seletor de cor */}
      <div
        className={`bg-white p-4 rounded-lg shadow-md border ${
          isEditing ? 'border-info ring-2 ring-info/30' : ''
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Personalize a cor</label>
        </div>

        {/* Caixa de visualização/acionamento do seletor nativo */}
        <div
          className="w-full h-24 rounded-lg border cursor-pointer transition-all hover:shadow-md relative group"
          style={{ backgroundColor: color }}
          onClick={(e) => {
            setIsEditing(true);
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = color;
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
              handleColorChange(target.value);
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
              setIsEditing(true);
              const hue = parseInt(e.target.value);
              setHueValue(hue);
              const hex = hslToHex(hue, 100, 50);
              handleColorChange(hex);
            }}
          />
          <div className="relative flex items-center self-center w-10">
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              onChange={(e) => {
                setIsEditing(true);
                handleColorChange(e.target.value);
              }}
              className="cursor-pointer rounded-lg overflow-hidden"
              style={{ padding: 0, backgroundColor: 'transparent' }}
            />
            <div
              className="absolute inset-0 pointer-events-none rounded border border-white top-1/2 -translate-y-1/2 h-8 w-12"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="text-sm">
            <span className="text-gray-500">Hex:</span> {color}
          </div>
        </div>
      </div>
    </div>
  );
};
