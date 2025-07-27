import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { OptionType } from '../constants/drink'
import { tagColorMap } from '../constants/drink'
import { Option, MultiValue } from './MultiSelectCustom'

type MultiSelectProps<T extends OptionType> = {
  options: T[]
  selected: T[]
  setSelected: (val: T[]) => void
  placeholder?: string
  maxToShow?: number
  creatable?: boolean
  onCreateOption?: (input: string) => void
}

const MultiSelect = <T extends OptionType>({
  options,
  selected,
  setSelected,
  placeholder = 'Select options',
  maxToShow = 2,
  creatable = false,
  onCreateOption,
}: MultiSelectProps<T>) => {
  const WrappedMultiValue = (props: any) => <MultiValue {...props} maxToShow={maxToShow} />;

  const customStyles = {
    // option
    option: (
      base: any,
      {
        data,
        isFocused,
        isSelected,
      }: {
        data: OptionType
        isFocused: boolean
        isSelected: boolean
      }
    ) => {
      const tagColor = tagColorMap[data.type]
      const bgColor =
        tagColor && data.opacity !== undefined
          ? tagColor.bg(data.opacity / 100)
          : 'var(--color-surface)'
      const textColor = tagColor ? tagColor.text : 'var(--color-text)'

      return {
        ...base,
        backgroundColor: isFocused ? bgColor : 'transparent',
        color: textColor,
        cursor: 'pointer',
        fontWeight: isSelected ? 'bold' : 'normal',
      }
    },
    // selected item tag
    multiValue: (base: any, {data}: {data: OptionType}) => {
      const tagColor = tagColorMap[data.type]
      const bgColor =
        tagColor && data.opacity !== undefined
          ? tagColor.bg(data.opacity / 100)
          : 'var(--color-surface)'
      const textColor = tagColor ? tagColor.text : 'var(--color-text)'

      return {
        ...base,
        backgroundColor: bgColor,
        borderRadius: 9999,
        fontSize: '1rem',
        padding: '1px 4px',
        color: textColor,
      }
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
  }

  const SelectComponent = creatable ? CreatableSelect : Select

  return (
    <SelectComponent
      isMulti
      options={options}
      value={selected}
      onChange={newVal => setSelected([...newVal])}
      placeholder={placeholder}
      styles={customStyles}
      components={{MultiValue: WrappedMultiValue, Option}}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      className="w-full text-m"
      onCreateOption={creatable ? onCreateOption : undefined}
    />
  )
}

export default MultiSelect
