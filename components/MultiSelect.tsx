'use client';
import Select, { OnChangeValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { tagColorMap, SugarIceLabelType } from '../constants/drink'
import { Option, MultiValue } from './MultiSelectCustom'
import { BaseSelectOptionType } from '../types/selectOptionType'

export type OptionType = SugarIceLabelType | BaseSelectOptionType;

type MultiSelectProps<T extends OptionType> = {
  options: T[]
  selected: T[]
  setSelected: (_val: T[]) => void
  placeholder?: string
  maxToShow?: number
  backgroundColor?: string
  borderColor?: string
  minWidth?: number
  showDeleteAllBtn?: boolean
  creatable?: boolean
  onCreateOption?: (_input: string) => void
}

const MultiSelect = <T extends OptionType>({
  options,
  selected,
  setSelected,
  placeholder = 'Select options',
  maxToShow = 2,
  borderColor = 'surface',
  backgroundColor = 'var(--color-background)',
  minWidth,
  showDeleteAllBtn = true,
  creatable = false,
  onCreateOption,
}: MultiSelectProps<T>) => {
  const WrappedMultiValue = (props: any) => <MultiValue {...props} maxToShow={maxToShow} />;

  const customStyles = {
    // inout wrap before focus
    control: (provided: any, state: any) => ({
      ...provided,
      color: 'var(--color-text)',
      backgroundColor: backgroundColor,
      borderColor: state.isFocused ? 'var(--color-primary)' : `var(--color-${borderColor})`,
      borderWidth: '2px',
      borderRadius: '10px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'var(--color-primary)'
      },
      minWidth: minWidth ? `${minWidth}px` : 'auto'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'var(--color-text)',  // 選中後顯示的字色
    }),
    // down icon
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: 'var(--color-primary)',
      '&:hover': {
        color: 'var(--color-secondary)'
      }
    }),
    // divider
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--color-surface)',
      width: 2,
    }),
    // clear icon
    clearIndicator: (provided: any) => ({
      ...provided,
      color: 'var(--color-primary)',
      '&:hover': {
        color: 'var(--color-secondary)'
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'var(--color-surface)'
    }),
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
      let bgColor = 'var(--color-surface)';
      let textColor = 'var(--color-text)';

      if('type' in data && Object.hasOwn(tagColorMap, data.type)) {
        const tagColor = tagColorMap[data.type];
        bgColor = tagColor && data.opacity !== undefined
          ? tagColor.bg(data.opacity / 100)
          : bgColor;
        textColor = tagColor ? tagColor.text : textColor;
      };

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
      let bgColor = 'var(--color-surface)';
      let textColor = 'var(--color-text)';

      if('type' in data && Object.hasOwn(tagColorMap, data.type)) {
        const tagColor = tagColorMap[data.type];
        bgColor = tagColor && data.opacity !== undefined
          ? tagColor.bg(data.opacity / 100)
          : bgColor;
        textColor = tagColor ? tagColor.text : textColor;
      }

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
  };

  const SelectComponent = creatable ? CreatableSelect : Select;

  return (
    <SelectComponent<T, true>
      isMulti
      options={options}
      value={selected}
      onChange={(newVal: OnChangeValue<T, true>) => setSelected(newVal ? [...newVal] : [])}
      placeholder={placeholder}
      styles={customStyles}
      components={{MultiValue: WrappedMultiValue, Option}}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      className="w-full text-m"
      isClearable={showDeleteAllBtn}
      onCreateOption={creatable ? onCreateOption : undefined}
    />
  )
}

export default MultiSelect
