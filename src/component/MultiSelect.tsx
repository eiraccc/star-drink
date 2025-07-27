import { OptionType } from '../constants/drink'
import Select, { components } from 'react-select';
import { tagColorMap } from '../constants/drink';

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
}: MultiSelectProps) => {
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
        option: (base: any, { data, isFocused, isSelected }: {
          data: OptionType,
          isFocused: boolean,
          isSelected: boolean
        }) => {
          const type = data.type;
          const bgColor = isFocused && type ? tagColorMap[type]?.bg(data.opacity / 100) : 'transparent';
          const textColor = type ? tagColorMap[type]?.text : 'inherit';
        
          return {
            ...base,
            backgroundColor: bgColor,
            color: textColor,
            cursor: 'pointer',
            fontWeight: isSelected ? 'bold' : 'normal',
          };
        },
        // selected item tag
        multiValue: (base: any, { data }: { data: OptionType }) => {
          const type = data.type;
          const bgColor = type ? tagColorMap[type]?.bg(data.opacity / 100) : '#eee';
          const textColor = type ? tagColorMap[type]?.text : '#333';
      
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
            color: 'var(--color-secondary)',
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