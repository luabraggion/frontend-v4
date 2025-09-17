import { Label } from '@/components/forms/Labels';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import * as React from 'react';
import { cn } from '../../lib';

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
      <Label>{label}</Label>
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
