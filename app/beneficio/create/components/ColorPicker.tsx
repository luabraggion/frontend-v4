import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '@/styles/ColorPicker.css';
import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Função para converter HSL para RGB
function hslToRgb(h: number, s: number, l: number): number[] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // acromático
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Função para converter componentes RGB para HEX
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

// Função robusta para converter HSL para HEX
function hslToHex(h: number, s: number, l: number): string {
  // Garantir que h esteja entre 0-360
  h = ((h % 360) + 360) % 360;

  // Normalizar s e l para 0-1
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  // Se a saturação é zero, temos um tom de cinza
  if (s === 0) {
    const val = Math.round(l * 255);
    return `#${val.toString(16).padStart(2, '0').repeat(3)}`;
  }

  // Funções auxiliares
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

  // Converter para hexadecimal
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ColorPickerProps {
  maxColors?: number;
  defaultColors?: string[];
  onChange?: (colors: string[]) => void;
}

/**
 * Componente de seleção de cores para a roleta
 * Permite ao usuário selecionar até um número máximo de cores
 */
// Função auxiliar para converter HEX para HSL - implementação robusta
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Validar e formatar a entrada
  if (!hex) {
    return { h: 0, s: 0, l: 0 };
  }

  // Remover o # se presente
  hex = hex.replace(/^#/, '');

  // Validar o formato - deve ser 3 ou 6 caracteres hexadecimais
  if (!/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return { h: 0, s: 0, l: 0 };
  }

  // Expandir formato curto (exemplo: #ABC para #AABBCC)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  // Converter para RGB
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  // Encontrar valores mínimos e máximos de RGB
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  // Se não for um tom de cinza (onde r = g = b)
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

export const ColorPicker: React.FC<ColorPickerProps> = ({
  maxColors = 12,
  defaultColors = ['#F4A460', '#FFD700', '#9370DB', '#483D8B'],
  onChange,
}) => {
  // Estado para armazenar as cores selecionadas
  const [colors, setColors] = useState<string[]>(defaultColors);
  // Estado para a cor sendo editada atualmente
  const [currentColor, setCurrentColor] = useState<string>('#4F46E5');
  // Estado para controlar qual cor está sendo editada
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Estado para armazenar o valor atual do slider
  const [hueValue, setHueValue] = useState<number>(250); // Aproximadamente o hue do #4F46E5

  // Referência para o input range
  const sliderRef = useRef<HTMLInputElement>(null);

  // Efeito para atualizar o slider quando a cor atual mudar
  useEffect(() => {
    // Se a cor for em formato hex, tenta converter para HSL e atualizar o slider
    if (currentColor.startsWith('#') && sliderRef.current) {
      try {
        const { h } = hexToHSL(currentColor);
        setHueValue(h);
        sliderRef.current.value = h.toString();
      } catch (error) {
        console.error('Erro ao converter cor para HSL:', error);
      }
    }
  }, [currentColor]);

  // Função para adicionar uma nova cor
  const addColor = () => {
    if (colors.length < maxColors) {
      const newColors = [...colors, currentColor];
      setColors(newColors);
      onChange?.(newColors);
    }
  };

  // Função para remover uma cor
  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    onChange?.(newColors);

    // Se estiver editando a cor removida, resetar o estado de edição
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  // Função para editar uma cor existente
  const startEditingColor = (index: number) => {
    const selectedColor = colors[index];

    setCurrentColor(selectedColor);
    setEditingIndex(index);

    // Converter a cor HEX para HSL para atualizar o slider
    try {
      if (selectedColor && selectedColor.startsWith('#')) {
        // Usa a função auxiliar hexToHSL para obter o componente hue
        const { h } = hexToHSL(selectedColor);

        setHueValue(h);

        // Atualiza o valor do slider
        if (sliderRef.current) {
          sliderRef.current.value = h.toString();
        }
      }
    } catch (error) {
      console.error('Erro ao extrair hue da cor:', error);
      // Em caso de erro, usar um valor padrão
      setHueValue(0);
      if (sliderRef.current) {
        sliderRef.current.value = '0';
      }
    }
  };

  // Função para salvar a cor editada
  const saveEditedColor = () => {
    if (editingIndex !== null) {
      const newColors = [...colors];
      newColors[editingIndex] = currentColor;
      setColors(newColors);
      onChange?.(newColors);
      setEditingIndex(null);
    }
  };

  // Função para cancelar a edição
  const cancelEditing = () => {
    setEditingIndex(null);
  };

  // Função para lidar com a mudança de cor
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);

    // Atualização em tempo real da cor que está sendo editada
    if (editingIndex !== null) {
      const newColors = [...colors];
      newColors[editingIndex] = newColor;
      // Não chamamos o onChange aqui para só atualizar quando o usuário clicar em "Salvar"
      setColors(newColors);
    }

    try {
      // Tenta extrair o hue da nova cor hex
      const hex = newColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      let h = 0;
      if (max !== min) {
        if (max === r) {
          h = ((g - b) / (max - min)) % 6;
          if (h < 0) h += 6;
        } else if (max === g) {
          h = (b - r) / (max - min) + 2;
        } else {
          // max === b
          h = (r - g) / (max - min) + 4;
        }
      }

      const hue = Math.round(h * 60);
      setHueValue(hue);

      if (sliderRef.current) {
        sliderRef.current.value = hue.toString();
      }
    } catch (error) {
      console.error('Erro ao extrair o hue da cor:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-gray-500">
          Clique em uma cor para editá-la ou no botão + para adicionar uma nova.
        </p>
      </div>

      {/* Exibição das cores selecionadas com indicação para edição */}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div key={index} className={`relative group`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{ backgroundColor: color }}
                    className="w-10 h-10 rounded-full cursor-pointer border shadow-sm hover:scale-110 transition-transform flex items-center justify-center"
                    onClick={() => startEditingColor(index)}
                  >
                    {/* Conteúdo da cor */}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para editar esta cor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm invisible group-hover:visible"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColor(index);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover cor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}

        {/* Botão para adicionar nova cor (apenas se não atingiu o limite) */}
        {colors.length < maxColors && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={addColor}
                >
                  <Plus className="size-4 text-gray-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adicionar nova cor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Seletor de cores */}
      <div
        className={`bg-white p-4 rounded-lg shadow-md border ${editingIndex !== null ? 'border-info ring-2 ring-info/30' : ''}`}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">
            {editingIndex !== null ? `Editando cor ${editingIndex + 1}` : 'Escolha uma nova cor'}
          </label>
          <div className="text-xs text-gray-500">
            {colors.length}/{maxColors} cores
          </div>
        </div>

        {editingIndex !== null && (
          <div className="bg-accent text-accent-foreground text-xs p-2 rounded-md mb-3 flex items-start">
            <svg
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>
              Você está editando uma cor existente. Ajuste a cor conforme desejado e clique em{' '}
              <strong>Salvar</strong> para confirmar as alterações ou <strong>Cancelar</strong> para
              desistir.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div
            className="w-full h-24 rounded-lg border cursor-pointer transition-all hover:shadow-md relative group"
            style={{ backgroundColor: currentColor }}
            onClick={(e) => {
              // Capturar a posição do elemento clicado
              const rect = e.currentTarget.getBoundingClientRect();

              // Criar o elemento de input de cor
              const colorInput = document.createElement('input');
              colorInput.type = 'color';
              colorInput.value = currentColor;

              // Configurar o input para ser invisível mas na posição correta
              // Esta abordagem mantém o seletor de cores perto do ponto de clique
              // Usamos o evento MouseEvent para posicionar precisamente no local do clique
              colorInput.style.position = 'absolute';
              colorInput.style.left = `${e.clientX + window.scrollX}px`;
              colorInput.style.top = `${e.clientY + window.scrollY}px`;
              // Dimensões reais mínimas para garantir que o navegador possa detectar o clique
              colorInput.style.width = '24px';
              colorInput.style.height = '24px';
              colorInput.style.opacity = '0'; // Invisível mas funcional
              colorInput.style.padding = '0';
              colorInput.style.border = 'none';
              colorInput.style.cursor = 'pointer';

              // Adicionar ao DOM
              document.body.appendChild(colorInput);

              colorInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const newColor = target.value;

                setCurrentColor(newColor);

                // Atualizar as cores no estado
                if (editingIndex !== null) {
                  const newColors = [...colors];
                  newColors[editingIndex] = newColor;
                  setColors(newColors);
                }

                // Atualizar o slider
                try {
                  const { h } = hexToHSL(newColor);
                  setHueValue(h);
                  if (sliderRef.current) {
                    sliderRef.current.value = h.toString();
                  }
                } catch (error) {
                  console.error('Erro na conversão HEX para HSL:', error);
                }
              });

              // Função para remover o input de cor do DOM
              const removeColorInput = () => {
                if (document.body.contains(colorInput)) {
                  document.body.removeChild(colorInput);
                }
              };

              // Eventos para garantir a limpeza do elemento
              colorInput.addEventListener('change', removeColorInput);
              colorInput.addEventListener('blur', removeColorInput);

              // Armazenar o cursor original e mudar para crosshair
              const originalCursor = document.body.style.cursor;
              document.body.style.cursor = 'crosshair';

              // Armazenar uma referência segura ao elemento
              const colorBox = e.currentTarget;

              // Armazenar os estilos originais
              const originalBoxShadow = colorBox.style.boxShadow || '';
              const originalTransform = colorBox.style.transform || '';

              // Aplicar efeito visual de seleção
              colorBox.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.5)';
              colorBox.style.transform = 'scale(1.02)';

              // Restaurar o estado visual após a seleção de forma segura
              const restoreVisualState = () => {
                // Verificar se o elemento ainda existe no DOM antes de tentar modificá-lo
                if (colorBox && document.body.contains(colorBox)) {
                  colorBox.style.boxShadow = originalBoxShadow;
                  colorBox.style.transform = originalTransform;
                }
              };

              // Variável para controlar se a limpeza já foi realizada
              let cleanupDone = false;

              // Função estendida para limpar todos os elementos e restaurar o estado visual
              const cleanupElements = () => {
                // Evitar execução múltipla
                if (cleanupDone) return;
                cleanupDone = true;

                removeColorInput();
                document.body.style.cursor = originalCursor;
                restoreVisualState();
                window.removeEventListener('keydown', handleEscape);
              };

              // Manipular tecla ESC para cancelar
              const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                  cleanupElements();
                }
              };

              window.addEventListener('keydown', handleEscape);

              // Evento para limpar quando a seleção terminar
              colorInput.addEventListener('change', cleanupElements);
              colorInput.addEventListener('blur', cleanupElements);

              // Acionar o input imediatamente
              colorInput.click();
            }}
          >
            <div className="absolute inset-0 bg-opacity-0 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
              <span className="text-white opacity-0 group-hover:opacity-100 font-medium transition-opacity px-2 py-1 rounded bg-black bg-opacity-40 text-center">
                Clique para escolher uma cor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-x-2 h-10">
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

                try {
                  // Converter diretamente de HSL para HEX usando a nova função
                  const hexColor = hslToHex(hue, 100, 50); // Saturação 100%, Luminosidade 50%

                  // Atualizar a cor atual
                  setCurrentColor(hexColor);

                  // Se estiver editando, atualize as cores imediatamente
                  if (editingIndex !== null) {
                    const newColors = [...colors];
                    newColors[editingIndex] = hexColor;
                    setColors(newColors);
                  }
                } catch (error) {
                  console.error('Erro ao converter HSL para HEX:', error);
                }
              }}
            />
            <div className="relative flex items-center self-center w-10">
              <input
                type="color"
                value={currentColor}
                onChange={handleColorChange}
                className="cursor-pointer rounded-lg overflow-hidden"
                style={{
                  padding: 0,
                  backgroundColor: 'transparent',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none rounded border border-white top-1/2 -translate-y-1/2 h-8 w-12"
                aria-hidden="true"
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-500">Hex:</span> {currentColor}
            </div>

            {editingIndex !== null ? (
              <div className="space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditedColor}
                  className="px-3 py-1 text-sm bg-info text-info-foreground rounded-md hover:bg-info/90"
                >
                  Salvar
                </button>
              </div>
            ) : (
              colors.length > 1 && (
                <button
                  onClick={addColor}
                  disabled={colors.length >= maxColors}
                  className={`px-3 py-1 text-sm rounded-md ${
                    colors.length >= maxColors
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-info text-info-foreground hover:bg-info/90'
                  }`}
                >
                  Adicionar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
