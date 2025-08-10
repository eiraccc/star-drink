import { useState } from "react";
import Tooltip from "../../../component/Tooltip";
import { ShopType } from "../../../types/shop";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { RxCaretSort } from 'react-icons/rx';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
} from 'react-icons/ri';
import { shopColumns } from "../../../constants/shopColumnConfig";

interface propsType {
  shops: ShopType[];
  visableLabelKeys: string[]
  handleApprove: (id: string, data: ShopType) => void;
  openEdit: (shop: ShopType) => void;
  handleDelete: (id: string) => void;
  checkApproveValid: (shop: ShopType) => boolean;
  getApproveInvalidKey: (shop: ShopType) => string[];
}

type SortKey = 'createdAt' | 'updatedAt' | '';
type SortOrder = 'desc' | 'asc';
type SortType = {
  key: SortKey;
  order: SortOrder;
};


const ShopTable = ({
    shops,
    visableLabelKeys,
    handleApprove,
    openEdit,
    handleDelete,
    checkApproveValid,
    getApproveInvalidKey
}: propsType) => {
    const [sort, setSort] = useState<SortType>({
      key: '',
      order: 'desc'
    });
    const toggleSort = (key:SortKey) => {
      setSort(preSort => {
      if(key === preSort.key) {
        if(preSort.order === 'desc') {
            return {key, order: 'asc'}
        } else {
            // reset sort
            return {key: '', order: 'desc'}
        }
      } else {
          return {key, order: 'desc'}
      }
      })
    };

    const sortShops = sort.key ? shops.sort((a, b) => {
        return sort.order === 'desc'
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt);
    }) : shops;

    return (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-contrast text-sm text-center">
                <thead className="bg-surface text-text-secondary font-semibold">
                <tr>
                    {shopColumns.filter(col => visableLabelKeys.includes(col.key)).map(col => {
                        if(['createdAt', 'updatedAt'].includes(col.key)) {
                            return (
                                <th key={col.key} className="px-4 py-2">
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => toggleSort(col.key as SortKey)}
                                    >
                                        { col.label }
                                        {sort.key !== col.key ? (
                                            <RxCaretSort  size={16}/>
                                        ) : sort.order === 'desc' ? (
                                            <RiArrowUpSLine/>
                                        ) : (
                                            <RiArrowDownSLine />
                                        )}
                                    </div>
                                </th>
                            )
                        } else {
                            return <th key={col.key} className="px-4 py-2">{ col.label }</th>
                        }
                    })}
                    <th className="px-4 py-2">Approve</th>
                    <th className="px-4 py-2">Edit</th>
                    <th className="px-4 py-2">Delete</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sortShops.map((shop) => (
                        <tr key={shop.id} className="hover:bg-background">
                            {shopColumns.filter(col => visableLabelKeys.includes(col.key)).map(col => {
                                const val = shop[col.key as keyof ShopType];
                                let content;
                                switch (col.key) {
                                    case 'alias':
                                      content = Array.isArray(val) && val.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                          {val.map((item: string, i: number) => (
                                            <span
                                              key={i}
                                              className="inline-block px-2 py-1 bg-background text-text-secondary text-xs rounded-full whitespace-nowrap"
                                            >
                                              {item}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        '-'
                                      );
                                      break;
                          
                                    case 'isApproved':
                                      content = val ? (
                                        <div className="flex items-center justify-center text-success font-bold">
                                          <IoShieldCheckmark className="mr-1" /> Approved
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center text-danger font-bold">
                                          <FaRegClock className="mr-1" /> Pending
                                        </div>
                                      );
                                      break;
                          
                                    default:
                                      content = val;
                                  }

                                  return (
                                    <td key={col.key} className={`px-4 py-2 ${col.key==='slug' && 'whitespace-nowrap'}`}>
                                        { content || '-' }
                                    </td>
                                )
                            })}
                            <td className="px-4 py-2">
                                <Tooltip
                                    text={`Please complete: ${getApproveInvalidKey(shop).join(',')}`}
                                    show={!checkApproveValid(shop)}
                                >
                                    <button
                                        disabled={!checkApproveValid(shop) || shop.isApproved}
                                        onClick={() => handleApprove(shop.id, shop)}
                                        className="bg-highlight text-background px-5 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50"
                                    >Approve</button>
                                </Tooltip>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center justify-center">
                                    <MdEdit
                                        onClick={() => openEdit(shop)}
                                        className="text-primary hover:opacity-80 cursor-pointer align-middle"
                                        size={25}
                                    />
                                </div>
                                
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center justify-center">
                                    <MdDelete
                                        onClick={() => handleDelete(shop.id)}
                                        className="text-primary hover:opacity-80 cursor-pointer"
                                        size={25}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ShopTable