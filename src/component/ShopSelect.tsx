import { components } from 'react-select';
import SingleSelect, { OptionType } from './SingleSelect';
import { FaPlus } from 'react-icons/fa';
import { IoShieldCheckmark } from "react-icons/io5";

export interface OptionTypeWithApprovalStatus extends OptionType {
    isApproved?: boolean;
}
  
type ShopSelectProps = {
  options: OptionTypeWithApprovalStatus[];
  value: OptionTypeWithApprovalStatus | null;
  onChange: (option: OptionTypeWithApprovalStatus) => void;
  onAddShop?: () => void;
};

const ShopSelect = ({
    options,
    value,
    onChange,
    onAddShop,
}: ShopSelectProps) => {
    const CustomOptionWithVerified = (props: any) => {
        const { data } = props;
    
        return (
          <components.Option {...props}>
            <div className="flex items-center justify-between">
              <span>{data.label}</span>
              {data.isApproved ? (
                <IoShieldCheckmark className='text-success'/>
              ): (
                <span className="text-xs text-primary ml-2">Under Review</span>
              )}
            </div>
          </components.Option>
        );
      };
    
      const CustomMenuListWithAdd = (props: any) => {
        return (
            <components.MenuList {...props}>
                { props.children }
    
                {/* 自訂按鈕區塊 */}
                <div
                    onMouseDown={(e) => {
                        e.preventDefault(); // 阻止選單自動關閉
                        onAddShop && onAddShop();
                    }}
                    className="p-3 flex items-center justify-center gap-1 border-t border-dashed border-primary text-primary font-semibold cursor-pointer hover:bg-background"
                >
                    <FaPlus />
                    Add shop
                </div>
            </components.MenuList>
        );
      };
    return (
        <SingleSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder="Search or add a shop"
          borderColor="var(--color-primary)"
          components={{
            Option: CustomOptionWithVerified,
            MenuList: CustomMenuListWithAdd,
          }}
        />
    )
}

export default ShopSelect