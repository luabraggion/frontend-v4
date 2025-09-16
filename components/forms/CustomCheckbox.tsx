import * as React from 'react';
import { cn } from '../../lib';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default React.memo(CustomCheckbox);
