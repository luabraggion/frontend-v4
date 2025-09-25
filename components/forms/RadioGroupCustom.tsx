'use client';

import { Label } from '@/components/index';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

/**
 * Interface para um item do RadioGroup
 */
export interface RadioGroupItem {
  /** Valor único do item */
  value: string;
  /** Texto de exibição do item */
  label: string;
  /** ID opcional para o elemento de input. Se não fornecido, será gerado a partir do valor */
  id?: string;
}

interface RadioGroupCustomProps {
  /** Valor padrão selecionado */
  defaultValue?: string;
  /** Função chamada quando o valor é alterado */
  onChange?: (value: string) => void;
  /** Texto do rótulo acima do grupo de rádio */
  label?: string;
  /** Array de itens para renderizar no grupo de radio */
  items: RadioGroupItem[];
  /** Classe CSS adicional para o contêiner principal */
  className?: string;
  /** Classe CSS adicional para os itens do radio */
  itemClassName?: string;
  /** Classe CSS adicional para os labels dos itens */
  labelClassName?: string;
}

/**
 * Componente de grupo de radio buttons customizado e reutilizável
 */
export function RadioGroupCustom({
  defaultValue,
  onChange,
  label,
  items,
  className = '',
  itemClassName = '',
  labelClassName = 'font-normal text-sm text-gray-500',
}: RadioGroupCustomProps) {
  // Usar estritamente o valor padrão fornecido, sem substitutos automáticos
  // Se defaultValue não for fornecido, permanecerá como string vazia ou undefined
  const initialValue = defaultValue;
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Se não houver itens, retorna apenas um contêiner vazio ou nada, conforme necessário
  if (!items || items.length === 0) {
    return label ? <div className={className}>{label && <Label>{label}</Label>}</div> : null;
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {label && <Label>{label}</Label>}
      <RadioGroup value={value} onValueChange={handleValueChange} className="gap-2">
        {items.map((item: RadioGroupItem) => {
          const itemId = item.id || `radio-${item.value}`;
          return (
            <div key={itemId} className={`flex items-center space-x-2 ${itemClassName}`}>
              <RadioGroupItem value={item.value} id={itemId} />
              <Label htmlFor={itemId} className={labelClassName}>
                {item.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default RadioGroupCustom;
