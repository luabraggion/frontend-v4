import { Label } from '@/components/forms/Labels';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import { cn } from '@/lib';
import * as React from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  groupLabel?: string;
  label?: string;
  renderItem?: (props: { value: string; label: string }) => React.ReactNode; // Adiciona suporte para renderItem
  showToggleAll?: boolean; // Controla se o botão de selecionar/desmarcar todos deve ser exibido
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  className = '',
  groupLabel,
  label = 'Título',
  renderItem,
  showToggleAll = false, // Por padrão, não exibir o botão
}) => {
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (values: string[]) => {
    // Garante que o setState seja chamado fora do ciclo de renderização
    setTimeout(() => {
      if (isMounted.current) {
        onChange(values);
      }
    }, 0);
  };

  // Função para alternar entre selecionar todos ou desmarcar todos
  const handleToggleAll = () => {
    // Se todos os itens já estiverem selecionados ou pelo menos um item estiver selecionado,
    // desmarca todos. Caso contrário, seleciona todos.
    const allValues = options.map((option) => option.value);
    const allSelected =
      allValues.length === selectedValues.length &&
      allValues.every((value) => selectedValues.includes(value));

    // Se tiver algum selecionado, desmarca todos; se não tiver nenhum, marca todos
    const newValues = allSelected || selectedValues.length > 0 ? [] : allValues;

    handleChange(newValues);
  };

  const renderOptions = () =>
    options.map(({ value, label }) =>
      renderItem ? (
        renderItem({ value, label })
      ) : (
        <MultiSelectItem key={value} value={value}>
          {label}
        </MultiSelectItem>
      ),
    );

  return (
    <div className="flex flex-col gap-3 flex-grow w-full">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        {showToggleAll && (
          <button
            className="text-blue-500 hover:text-blue-400 hover:no-underline text-sm"
            onClick={handleToggleAll}
          >
            {selectedValues.length > 0 ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
        )}
      </div>
      <MultiSelect values={selectedValues} onValuesChange={handleChange}>
        <MultiSelectTrigger className={cn('w-auto', className)}>
          <MultiSelectValue placeholder={placeholder} />
        </MultiSelectTrigger>
        <MultiSelectContent>
          {groupLabel && <span className="font-bold text-sm px-2">{groupLabel}</span>}
          <MultiSelectGroup>{renderOptions()}</MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
};

export default React.memo(CustomMultiSelect);
