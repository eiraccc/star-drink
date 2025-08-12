'use client';
import { useState, KeyboardEvent } from 'react';
import { RxCross2 } from "react-icons/rx";

type ChipInputProps = {
  defaultValue: string[];
  onChange: (_newValue: string[]) => void;
  placeholder?: string;
};

const ChipInput = ({ defaultValue, onChange, placeholder }: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (!defaultValue.includes(inputValue.trim())) {
        onChange([...defaultValue, inputValue.trim()]);
      }
      setInputValue('');
      e.preventDefault();
    }
  };

  const removeChip = (index: number) => {
    const newChips = defaultValue.filter((_, i) => i !== index);
    onChange(newChips);
  };

  return (
    <div className="flex-1 border-b border-surface focus-within:border-primary flex flex-wrap items-center gap-2 py-1 px-1">
      {defaultValue.map((chip, idx) => (
        <div
          key={idx}
          className="flex items-center bg-surface text-text rounded-full px-3 py-1 text-sm"
        >
          {chip}
          <RxCross2
              onClick={() => removeChip(idx)}
              className="ml-2 text-text cursor-pointer hover:text-text-secondary focus:outline-none"
              type="button"
              aria-label={`Remove ${chip}`}
          />
        </div>
      ))}
      <input
        type="text"
        className="flex-grow bg-transparent outline-none min-w-[80px] placeholder-surface"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Add and press Enter'}
      />
    </div>
  );
};

export default ChipInput;
