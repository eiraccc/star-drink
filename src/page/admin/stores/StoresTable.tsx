import Tooltip from "../../../component/Tooltip";
import { StoreType } from "../../../types/store";

interface propsType {
  stores: StoreType[];
  handleApprove: (id: string, data: StoreType) => void;
  openEdit: (store: StoreType) => void;
  handleDelete: (id: string) => void;
  checkApproveValid: (store: StoreType) => boolean;
  getApproveInvalidKey: (store: StoreType) => string[];
}

const StoresTable = ({
    stores,
    handleApprove,
    openEdit,
    handleDelete,
    checkApproveValid,
    getApproveInvalidKey
}: propsType) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
            <thead className="bg-surface text-gray-600 font-semibold">
            <tr>
                <th className="px-4 py-2">Store Name (EN)</th>
                <th className="px-4 py-2">Store Name (ZH)</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Alias</th>
                <th className="px-4 py-2">Submitted Name</th>
                <th className="px-4 py-2">Submitted Note</th>
                <th className="px-4 py-2">Submitted By</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Approval Status</th>
                <th className="px-4 py-2">Approve</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">{store.nameEn || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.nameZh || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.slug || '-'}</td>
                    <td className="px-4 py-2 text-center">
                        {store.alias.length ? store.alias.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-2 text-center">{store.submittedName || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.submittedNote || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.submittedBy || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.description || '-'}</td>
                    <td className="px-4 py-2 text-center">{store.createdAt}</td>
                    <td className="px-4 py-2 text-center">{store.updatedAt}</td>
                    <td className="px-4 py-2 text-center">{store.isApproved ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-center">
                        <Tooltip
                            text={`Please complete: ${getApproveInvalidKey(store).join(',')}`}
                            show={!checkApproveValid(store)}
                        >
                            <button
                                disabled={!checkApproveValid(store) || store.isApproved}
                                onClick={() => handleApprove(store.id, store)}
                                className="bg-highlight text-background px-5 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50"
                            >Approve</button>
                        </Tooltip>
                    </td>
                    <td className="px-4 py-2">
                        <button
                            onClick={() => openEdit(store)}
                            className="bg-primary text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                        >Edit</button>
                    </td>
                    <td className="px-4 py-2">
                        <button
                            onClick={() => handleDelete(store.id)}
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

export default StoresTable