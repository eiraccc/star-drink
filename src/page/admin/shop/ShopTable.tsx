import Tooltip from "../../../component/Tooltip";
import { ShopType } from "../../../types/shop";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

interface propsType {
  shops: ShopType[];
  type: 'all' | 'approved' | 'pending';
  handleApprove: (id: string, data: ShopType) => void;
  openEdit: (shop: ShopType) => void;
  handleDelete: (id: string) => void;
  checkApproveValid: (shop: ShopType) => boolean;
  getApproveInvalidKey: (shop: ShopType) => string[];
}

const ShopTable = ({
    shops,
    type,
    handleApprove,
    openEdit,
    handleDelete,
    checkApproveValid,
    getApproveInvalidKey
}: propsType) => {
    const columns = [
      { key: 'nameEn', label: 'Shop Name (EN)' },
      { key: 'nameZh', label: 'Shop Name (ZH)' },
      { key: 'slug', label: 'Slug' },
      { key: 'alias', label: 'Alias', render: (val: string[]) => (
        val.length ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {val.map((item, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-background text-text-secondary text-xs rounded-full whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : ('-')
      ) },
      { key: 'submittedName', label: 'Submitted Name' },
      { key: 'submittedNote', label: 'Submitted Note' },
      { key: 'submittedBy', label: 'Submitted By' },
      { key: 'description', label: 'Description' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'updatedAt', label: 'Updated At' },
      { key: 'isApproved', label: 'Approval Status', render: (val: boolean) => (
        val ? (
            <div className="flex items-center text-success font-bold">
                <IoShieldCheckmark className="mr-1" />Approved
            </div>
        ) : (
            <div className="flex items-center text-danger font-bold">
                <FaRegClock className="mr-1" />Pending
            </div>
        )
      ) },
    ];
    const visableKeysMap:any = {
        pending: ['nameEn', 'nameZh', 'slug', 'submittedName', 'submittedBy', 'submittedNote', 'createdAt', 'isApproved'],
        approved: ['nameEn', 'nameZh', 'slug', 'alias', 'createdAt', 'isApproved'],
        all: ['nameEn', 'nameZh', 'slug', 'alias', 'createdAt', 'updatedAt',  'isApproved'],
    };
    const visableKeys = visableKeysMap[type] || [];
    
    return (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-contrast text-sm text-center">
                <thead className="bg-surface text-text-secondary font-semibold">
                <tr>
                    {columns.filter(col => visableKeys.includes(col.key)).map(col => (
                        <th key={col.key} className="px-4 py-2">{ col.label }</th>
                    ))}
                    <th className="px-4 py-2">Approve</th>
                    <th className="px-4 py-2">Edit</th>
                    <th className="px-4 py-2">Delete</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {shops.map((shop) => (
                        <tr key={shop.id} className="hover:bg-background">
                            {columns.filter(col => visableKeys.includes(col.key)).map(col => (
                                <td key={col.key} className={`px-4 py-2 ${col.key==='slug' && 'whitespace-nowrap'}`}>
                                    {col.render
                                        ? col.render((shop as any)[col.key])
                                        : (shop as any)[col.key] || '-'}
                                </td>
                            ))}
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
                                <button
                                    onClick={() => openEdit(shop)}
                                    className="bg-primary text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                                >Edit</button>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleDelete(shop.id)}
                                    className="bg-danger text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ShopTable