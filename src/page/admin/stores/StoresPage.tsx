import { useEffect, useState } from "react"
import { StoreType, StoreTypeFormType } from "../../../types/store";
import {
    getStores as getStoresFromFB,
    addStore as addStoreToFB,
    editStore as editStoreToFB,
    deleteStore as deleteStoreInFB,
    approveStore
} from "../../../utils/storesService";
import SingleSelect, { OptionType }  from "../../../component/SingleSelect";
import StoresTable from "./StoresTable";
import StoresEditModal from "./StoresEditModal";
import LoadingOverlay from "../../../component/LoadingOverlay";
import ErrorSection from "../../../component/ErrorSection";
import { FaPlus } from 'react-icons/fa';

const StoresPage = () => {
    const [stores, setStores] = useState<StoreType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<'edit' | 'add' | ''>('');

    const filterOptions: OptionType[] = [
      { value: 'all', label: 'All' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Pending' },
    ];
    
    const [filterSelected, setFilterSelected] = useState<OptionType>(filterOptions[0]);
    const filterType = filterSelected.value;
    const filterStores = stores.filter(n => {
        if(filterType === 'all') return n;
        return n.isApproved === (filterType === 'approved')
    });

    const fetchStore = async () => {
      try {
        const data = await getStoresFromFB();
        data && setStores(data);
        console.log('get data', data);
      } catch (error) {
        console.error('get stores error', error);
      } finally {
      }
    };

    const initGetStore = async () => {
        setIsLoading(true);
        await fetchStore();
        setIsLoading(false);
    };

    useEffect(() => {
        initGetStore();
    }, [])

    const checkKeys: (keyof StoreType)[] = ['nameEn', 'nameZh', 'slug', 'description'];

    const checkApproveValid = (data: StoreType) => {
        return checkKeys.every(key => data[key] !== '') && data.alias.length > 0
    }

    const getApproveInvalidKey = (data: StoreType) => {
        let invalidKeys = checkKeys.filter(key => data[key] === '');
        if(!data.alias.length) invalidKeys.push('alias');
        return invalidKeys;
    }

    const handleApprove = async (storeId: string, data: StoreType) => {
        if(!checkApproveValid(data) || data.isApproved) return;

        setIsLoading(true);
        try {
            await approveStore(storeId);
            await fetchStore();
        } catch (error) {
            console.error('set isApproved error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editData, setEditData] = useState<StoreType | StoreTypeFormType | null>(null);

    const openEdit = (data: StoreType) => {
        setEditMode('edit');
        setShowEditModal(true);
        setEditData(data);
    };

    const initAddData: StoreTypeFormType = {
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
            const {createdAt, ...editItem} = editData as StoreType;
            await editStoreToFB(editItem);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            await fetchStore();
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
            await addStoreToFB(editData);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            await fetchStore();
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

    const handleDelete = async (storeId: string) => {
        setIsLoading(true);
        try {
            await deleteStoreInFB(storeId);
            await fetchStore();
        } catch (error) {
            console.log('delete error')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
           <StoresEditModal
                editMode={editMode}
                isOpen={showEditModal}
                editData={editData}
                setEditData={setEditData}
                onSave={editMode === 'edit' ? handleEdit : handleAdd}
                onCancel={handleCancel}
           />
           
            <div className="flex justify-between p-2">
                <div className="flex items-center">
                    <p className="mr-2">Filter:</p>
                    <SingleSelect
                        options={filterOptions}
                        value={filterSelected}
                        onChange={setFilterSelected}
                        placeholder="Filter stores"
                        backgroundColor='white'
                    />
                </div>
                <button
                    onClick={() => openAdd()}
                    className="flex items-center bg-highlight text-white rounded-full px-2 py-2 mr-2 hover:opacity-90"
                >
                    <FaPlus className='mr-2'/>
                    Add Store
                </button>
            </div>

            {isLoading ? <LoadingOverlay /> : stores.length ? (
                <StoresTable
                    stores={filterStores}
                    type={filterType}
                    handleApprove={handleApprove}
                    openEdit={openEdit}
                    handleDelete={handleDelete}
                    checkApproveValid={checkApproveValid}
                    getApproveInvalidKey={getApproveInvalidKey}
                />
            ) : (
                 <ErrorSection
                    errorMsg="No store yet!"
                 />
            )}
        </section>
    )
}

export default StoresPage