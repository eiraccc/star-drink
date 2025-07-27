import { components } from 'react-select'
import { FaCheck } from 'react-icons/fa'

export const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex justify-between items-center">
        <span>{props.data.label}</span>
        {props.isSelected && <FaCheck />}
      </div>
    </components.Option>
  )
};

export const MultiValue = (props: any) => {
  const {index, getValue, data, maxToShow} = props
  const selectedValues = getValue()

  if (index < maxToShow) {
    // 顯示前幾個選項的標籤
    return <components.MultiValue {...props} />
  }

  if (index === maxToShow) {
    // 超過的顯示 "+N more" 標籤
    const moreCount = selectedValues.length - maxToShow
    return (
      <div
        className="text-xs text-text-secondary ml-1 cursor-default select-none"
        title={selectedValues
          .slice(maxToShow)
          .map((v: any) => v.label)
          .join(', ')}>
        +{moreCount} more
      </div>
    )
  }

  // 其他多餘的標籤不渲染
  return null;
};
