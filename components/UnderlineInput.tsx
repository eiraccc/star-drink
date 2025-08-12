import type { ChangeEvent } from 'react';

interface UnderlineInputProps {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

const UnderlineInput = ({
  id,
  label,
  defaultValue,
  onChange,
  required = false,
  type = 'text',
}: UnderlineInputProps) => {
  return (
    <div className="mb-3 flex items-center">
      <label htmlFor={id} className="mb-1 w-[140px]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="flex-1 border-0 border-b border-surface focus:border-primary focus:outline-none focus:ring-0 bg-transparent py-1 px-2"
        value={defaultValue}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default UnderlineInput;
