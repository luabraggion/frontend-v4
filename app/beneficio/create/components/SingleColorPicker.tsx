import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useRef, useState } from 'react';

interface SingleColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
  label?: string;
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

  // Referência para o input de cor
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Função para lidar com a mudança de cor
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
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
                className="w-12 h-12 rounded-full cursor-pointer border shadow-sm hover:scale-105 transition-transform"
                onClick={() => colorInputRef.current?.click()}
                aria-label="Clique para selecionar uma cor"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para selecionar uma cor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm font-medium">{color}</span>
      </div>

      {/* Seletor de cor */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Personalize a cor</label>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="w-full h-24 rounded-lg border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => colorInputRef.current?.click()}
          />

          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max="360"
              className="flex-1"
              onChange={(e) => {
                const hue = e.target.value;
                const newColor = `hsl(${hue}, 100%, 50%)`;
                setColor(newColor);
                onChange?.(newColor);
              }}
            />
            <input
              type="color"
              ref={colorInputRef}
              value={color}
              onChange={handleColorChange}
              className="w-12 h-8"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-500">Hex:</span> {color}
            </div>

            <div
              className="text-sm text-info cursor-pointer hover:underline"
              onClick={() => colorInputRef.current?.click()}
            >
              Clique para selecionar a cor exata
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
