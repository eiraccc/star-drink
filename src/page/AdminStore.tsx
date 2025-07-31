import { useEffect, useState } from "react"
import { StoreType } from "../types/store";
import { getStores as getStoresFromFB } from "../utils/storesService";

const AdminStore = () => {
    const [stores, setStores] = useState<StoreType[]>([])

    const fetchStore = async () => {
        try {
          const data = await getStoresFromFB();
          data && setStores(data);
          console.log('get data', data);
        } catch (error) {
          console.error('get reviews error', error);
        } finally {
        }
      };
    useEffect(() => {
        fetchStore();
    }, [])
    return (
        <section>
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
                            <td className="px-4 py-2">{store.nameEn}</td>
                            <td className="px-4 py-2">{store.nameZh}</td>
                            <td className="px-4 py-2 text-blue-600">{store.slug}</td>
                            <td className="px-4 py-2">
                                {store.alias.length ? store.alias.join(", ") : "-"}
                            </td>
                            <td className="px-4 py-2">{store.submittedName}</td>
                            <td className="px-4 py-2">{store.submittedNote}</td>
                            <td className="px-4 py-2">{store.submittedBy}</td>
                            <td className="px-4 py-2">{store.createdAt}</td>
                            <td className="px-4 py-2">{store.updatedAt}</td>
                            <td className="px-4 py-2">{store.isApproved ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-2">
                                <button className="bg-highlight text-background px-5 py-2 rounded-md text-sm hover:opacity-90">Approve</button>
                            </td>
                            <td className="px-4 py-2">
                                <button className="bg-primary text-background px-5 py-2 rounded-md text-sm hover:opacity-90">Edit</button>
                            </td>
                            <td className="px-4 py-2">
                                <button className="bg-danger text-background px-5 py-2 rounded-md text-sm hover:opacity-90">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default AdminStore