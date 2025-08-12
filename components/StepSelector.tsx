import { useState, useEffect, useRef } from 'react';
import { SugarIceLabelType } from '../constants/drink';

type propsType = {
  options: SugarIceLabelType[];
  selectedValue: number;
  onChange: (_value: number) => void;
  activeColorClass: string;
  baseColorClass: string;
  lineColorClass: string;
  labelColorClass: string;
};

const StepSelector = ({
  options,
  selectedValue,
  onChange,
  activeColorClass,
  baseColorClass,
  lineColorClass,
  labelColorClass,
}: propsType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const lineCount = options.length - 1;
  const dotSize = 20;
  const totalDotWidth = dotSize * options.length;
  const lineWidth =
    lineCount > 0 ? (containerWidth - totalDotWidth) / lineCount : 0;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-between mt-2 px-2 pb-10">
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;
        const isLast = index === options.length - 1;

        return (
          <div
            key={option.value}
            className="relative z-5 flex flex-col items-center cursor-pointer"
            onClick={() => onChange(option.value)}>
            {/* dot */}
            <div
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                isSelected ? activeColorClass : baseColorClass
              }`}
            />

            {/* label */}
            <span
              className={`absolute top-7 w-12 text-[12px] text-center whitespace-pre-line leading-tight ${labelColorClass}`}>
              {option.label}
            </span>

            {/* line */}
            {!isLast && (
              <div
                className={`absolute top-2 left-5 h-1 ${lineColorClass} pointer-events-none`}
                style={{ width: lineWidth }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepSelector;
