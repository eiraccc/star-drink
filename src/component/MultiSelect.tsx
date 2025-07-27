import { OptionType } from '../constants/drink'
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { tagColorMap } from '../constants/drink';

type MultiSelectProps<T extends OptionType> = {
  options: T[];
  selected: T[];
  setSelected: (val: T[]) => void;
  placeholder?: string;
  maxToShow?: number;
  creatable?: boolean;
  onCreateOption?: (input: string) => void;
};

const MultiSelect = <T extends OptionType>({
  options,
  selected,
  setSelected,
  placeholder = 'Select options',
  maxToShow = 2,
  creatable = false,
  onCreateOption
}: MultiSelectProps<T>) => {
      const MultiValue = (props: any) => {
        const { index, getValue, data } = props;
        const selectedValues = getValue();
    
        if (index < maxToShow) {
          // 顯示前幾個選項的標籤
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
          const tagColor = tagColorMap[data.type];
          const bgColor = tagColor && data.opacity !== undefined 
              ? tagColor.bg(data.opacity / 100) 
              : 'var(--color-surface)';
          const textColor = tagColor ? tagColor.text : 'var(--color-text)';
          
          return {
            ...base,
            backgroundColor: isFocused ? bgColor : 'transparent',
            color: textColor,
            cursor: 'pointer',
            fontWeight: isSelected ? 'bold' : 'normal',
          };
        },
        // selected item tag
        multiValue: (base: any, { data }: { data: OptionType }) => {
          const tagColor = tagColorMap[data.type];
          const bgColor = tagColor && data.opacity !== undefined 
              ? tagColor.bg(data.opacity / 100) 
              : 'var(--color-surface)';
          const textColor = tagColor ? tagColor.text : 'var(--color-text)';

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

      const SelectComponent = creatable ? CreatableSelect : Select;

    return (
        <SelectComponent
            isMulti
            options={options}
            value={selected}
            onChange={(newVal) => setSelected([...newVal])}
            placeholder={placeholder}
            styles={customStyles}
            components={{ MultiValue }}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            className="w-full text-m"
            onCreateOption={creatable ? onCreateOption : undefined}
        />
    )
}

export default MultiSelect