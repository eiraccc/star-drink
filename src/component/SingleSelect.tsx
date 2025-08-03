import Select from 'react-select'

export type OptionType = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  options: OptionType[];
  value: OptionType | null;
  onChange: (option: OptionType) => void;
  placeholder?: string;
  backgroundColor?: string;
  borderColor?: string;
  focusColor?: string;
};


const SingleSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    backgroundColor = 'var(--color-background)',
    borderColor = 'var(--color-surface)',
    focusColor = 'var(--color-primary)',
}: SingleSelectProps) => {

    const customStyles = {
        // inout wrap before focus
        control: (provided: any, state: any) => ({
            ...provided,
            width: '150px',
            backgroundColor: backgroundColor,
            borderColor: state.isFocused ? focusColor : borderColor,
            borderWidth: '2px',
            borderRadius: '10px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: focusColor
            }
        }),
        // down icon
        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            color: focusColor,
            '&:hover': {
                color: 'var(--color-secondary)'
            }
        }),
        // divider
        indicatorSeparator: (provided:any) => ({
            ...provided,
            backgroundColor: borderColor,
            width: 2,
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: borderColor
        }),
        // option
        option: (
            base: any,
            {
                isFocused,
                isSelected,
            }: {
                data: OptionType
                isFocused: boolean
                isSelected: boolean
            }
        ) => {
            return {
                ...base,
                backgroundColor: isFocused ? borderColor : 'transparent',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : 'normal',
            }
        },
    }

    return (
        <Select
        options={options}
        value={value}
        onChange={(option) => {option && onChange(option)}}
        placeholder={placeholder}
        styles={customStyles}
        />
    )
}

export default SingleSelect