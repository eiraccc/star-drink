import { OptionType } from '../constants/drink'
import Select, { components } from 'react-select';

type MultiSelectProps = {
  options: OptionType[];
  selected: OptionType[];
  setSelected: (val: OptionType[]) => void;
  placeholder?: string;
  maxToShow?: number;
};

const MultiSelectDropdown = ({
  options,
  selected,
  setSelected,
  placeholder = 'Select options',
  maxToShow = 2
}:MultiSelectProps ) => {
    const MultiValue = (props: any) => {
        const { index, getValue, data } = props;
        const selectedValues = getValue();
    
        if (index < maxToShow) {
          // 顯示前兩個選項的標籤
          return <components.MultiValue {...props} />;
        }
    
        if (index === maxToShow) {
          // 超過的顯示 "+N more" 標籤
          const moreCount = selectedValues.length - maxToShow;
          return (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#666',
                marginLeft: 4,
                cursor: 'default',
                userSelect: 'none',
              }}
              title={selectedValues.slice(maxToShow).map((v: any) => v.label).join(', ')}
            >
              +{moreCount} more
            </div>
          );
        }
    
        // 其他多餘的標籤不渲染
        return null;
      };
    
      const customStyles = {
        // option
        option: (base: any, { data, isFocused, isSelected }: any) => {
          let bgColor = 'transparent';
          if (isFocused) {
            // 滑鼠hover時底色，可以用淡色或稍微調整透明度
            if (data.type === 'sugar') {
              bgColor = `rgba(216, 167, 177, ${data.opacity / 100})`;
            } else if (data.type === 'ice') {
              bgColor = `rgba(168, 183, 199, ${data.opacity / 100})`;
            }
          }
        
          return {
            ...base,
            backgroundColor: bgColor,
            color: data.type === 'sugar' ? 'var(--color-text-sugar)' : 'var(--color-text-ice)',
            cursor: 'pointer',
            fontWeight: isSelected ? 'bold' : 'normal',
          };
        },
        // selected item tag
        multiValue: (base: any, { data }: { data: OptionType }) => {
          let bgColor = '#000';
          let textColor = '#333';
      
          if (data.type === 'sugar') {
            bgColor = `rgb(var(--color-primary-sugar-rgb) / ${data.opacity / 100})`;
            textColor = 'var(--color-text-sugar)';
          } else if (data.type === 'ice') {
            bgColor = `rgb(var(--color-primary-ice-rgb) / ${data.opacity / 100})`;
            textColor = 'var(--color-text-ice)';
          }
      
          return {
            ...base,
            backgroundColor: bgColor,
            borderRadius: 9999,
            fontSize: '1rem',
            padding: '1px 4px',
            color: textColor,
          };
        },
        // selected item label
        multiValueLabel: (base: any) => ({
          ...base,
          color: 'inherit',
        }),
        // selected item remove btn
        multiValueRemove: (base: any) => ({
          ...base,
          ':hover': {
            color: '#9C7B5F',
          },
        }),
      };

    return (
        <Select
            isMulti
            options={options}
            value={selected}
            onChange={(newVal) => setSelected(newVal as OptionType[])}
            placeholder={placeholder}
            styles={customStyles}
            components={{ MultiValue }}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            className="w-full text-m"
        />
    )
}

export default MultiSelectDropdown