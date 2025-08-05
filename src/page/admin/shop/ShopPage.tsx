import { useEffect, useState } from "react"
import { ShopType, ShopFormType } from "../../../types/shop";
import {
    getShops as getShopsFromFB,
    addShop as addShopToFB,
    editShop as editShopToFB,
    deleteShop as deleteShopInFB,
    approveShop
} from "../../../utils/shopService";
import SingleSelect, { OptionType }  from "../../../component/SingleSelect";
import ShopTable from "./ShopTable";
import ShopEditModal from "./ShopEditModal";
import LoadingOverlay from "../../../component/LoadingOverlay";
import ErrorSection from "../../../component/ErrorSection";
import { FaPlus } from 'react-icons/fa';

const ShopPage = () => {
    const [shops, setShops] = useState<ShopType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<'edit' | 'add' | ''>('');

    const filterOptions: OptionType[] = [
      { value: 'all', label: 'All' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Pending' },
    ];
    
    const [filterSelected, setFilterSelected] = useState<OptionType>(filterOptions[0]);
    const filterType = filterSelected.value as 'all' | 'approved' | 'pending';
    const filtershops = shops.filter(n => {
        if(filterType === 'all') return n;
        return n.isApproved === (filterType === 'approved')
    });

    const fetchShop = async () => {
      try {
        const data = await getShopsFromFB();
        data && setShops(data);
        console.log('get data', data);
      } catch (error) {
        console.error('get shops error', error);
      } finally {
      }
    };

    const initGetShop = async () => {
        setIsLoading(true);
        await fetchShop();
        setIsLoading(false);
    };

    useEffect(() => {
        initGetShop();
    }, [])

    const checkKeys: (keyof ShopType)[] = ['nameEn', 'nameZh', 'slug', 'description'];

    const checkApproveValid = (data: ShopType) => {
        return checkKeys.every(key => data[key] !== '') && data.alias.length > 0
    }

    const getApproveInvalidKey = (data: ShopType) => {
        let invalidKeys = checkKeys.filter(key => data[key] === '');
        if(!data.alias.length) invalidKeys.push('alias');
        return invalidKeys;
    }

    const handleApprove = async (shopId: string, data: ShopType) => {
        if(!checkApproveValid(data) || data.isApproved) return;

        setIsLoading(true);
        try {
            await approveShop(shopId);
            await fetchShop();
        } catch (error) {
            console.error('set isApproved error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editData, setEditData] = useState<ShopType | ShopFormType | null>(null);

    const openEdit = (data: ShopType) => {
        setEditMode('edit');
        setShowEditModal(true);
        setEditData(data);
    };

    const initAddData: ShopFormType = {
        nameEn: '',
        nameZh: '',
        slug: '',
        alias: [],
        description: '',
        submittedName: '',
        submittedNote: '',
        submittedBy: 'admin_test',
        submittedByRole: 'admin',
        isApproved: true
    }

    const openAdd = () => {
        setEditMode('add');
        setShowEditModal(true);
        setEditData(initAddData);
    }

    const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!editData) return;
        setIsLoading(true);
        try {
            const {createdAt, ...editItem} = editData as ShopType;
            await editShopToFB(editItem);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            await fetchShop();
        } catch (error) {
            console.log('edit error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!editData) return;
        setIsLoading(true);
        try {
            await addShopToFB(editData);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            await fetchShop();
        } catch (error) {
            console.log('edit error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode('');
        setShowEditModal(false);
        setEditData(null);
    };

    const handleDelete = async (shopId: string) => {
        setIsLoading(true);
        try {
            await deleteShopInFB(shopId);
            await fetchShop();
        } catch (error) {
            console.log('delete error')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
           <ShopEditModal
                editMode={editMode}
                isOpen={showEditModal}
                editData={editData}
                setEditData={setEditData}
                onSave={editMode === 'edit' ? handleEdit : handleAdd}
                onCancel={handleCancel}
           />
           
            <div className="flex justify-between p-2">
                <div className="flex items-center">
                    <p className="mr-2">Approval Status:</p>
                    <SingleSelect
                        options={filterOptions}
                        value={filterSelected}
                        onChange={setFilterSelected}
                        placeholder="Filter shops"
                        backgroundColor='var(--color-contrast)'
                    />
                </div>
                <button
                    onClick={() => openAdd()}
                    className="flex items-center bg-highlight text-contrast rounded-full px-2 py-2 mr-2 hover:opacity-90"
                >
                    <FaPlus className='mr-2'/>
                    Add Shop
                </button>
            </div>

            {isLoading ? <LoadingOverlay /> : shops.length ? (
                <ShopTable
                    shops={filtershops}
                    type={filterType}
                    handleApprove={handleApprove}
                    openEdit={openEdit}
                    handleDelete={handleDelete}
                    checkApproveValid={checkApproveValid}
                    getApproveInvalidKey={getApproveInvalidKey}
                />
            ) : (
                 <ErrorSection
                    errorMsg="No shop yet!"
                 />
            )}
        </section>
    )
}

export default ShopPage