import { useEffect, useState } from "react"
import { ShopType, ShopFormType } from "../../../types/shop";
import {
    addShop as addShopToFB,
    editShop as editShopToFB,
    deleteShop as deleteShopInFB,
    approveShop
} from "../../../utils/shopService";
import { BaseSelectOptionType } from "../../../types/selectOptionType";
import SingleSelect from "../../../component/SingleSelect";
import MultiSelect from "../../../component/MultiSelect";
import ShopTable from "./ShopTable";
import ShopEditModal from "./ShopEditModal";
import LoadingOverlay from "../../../component/LoadingOverlay";
import ErrorSection from "../../../component/ErrorSection";
import { FaPlus } from 'react-icons/fa';
import { useShop } from "../../../context/ShopContext";
import { shopColumns, typeToInitColumnsMap, ApprovalStatusType } from "../../../constants/shopColumnConfig";

const ShopPage = () => {
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<'edit' | 'add' | ''>('');
    const { allShops, isLoadingAllShop } = useShop();

    const isLoading = isLoadingAction || isLoadingAllShop;

    const filterOptions: BaseSelectOptionType[] = [
      { value: 'all', label: 'All' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Pending' },
    ];
    
    const [filterSelected, setFilterSelected] = useState<BaseSelectOptionType>(filterOptions[0]);
    const filterType = filterSelected.value as ApprovalStatusType;
    const filtershops = allShops.filter(n => {
        if(filterType === 'all') return n;
        return n.isApproved === (filterType === 'approved')
    });
  
    const labelOptions = shopColumns.map(n => ({
        value: n.key,
        label: n.label
    }));
    const [selectedVisableLabels, setSelectedVisableLabels] = useState<BaseSelectOptionType[]>([]);
    
    useEffect(() => {
        setSelectedVisableLabels(labelOptions.filter(n => {
            return typeToInitColumnsMap[filterType].includes(n.value);
        }));
    }, [filterType]);


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

        setIsLoadingAction(true);
        try {
            await approveShop(shopId);
            // await fetchShop();
        } catch (error) {
            console.error('set isApproved error', error);
        } finally {
            setIsLoadingAction(false);
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
        setIsLoadingAction(true);
        try {
            const {createdAt, ...editItem} = editData as ShopType;
            await editShopToFB(editItem);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            // await fetchShop();
        } catch (error) {
            console.log('edit error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!editData) return;
        setIsLoadingAction(true);
        try {
            await addShopToFB(editData);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            // await fetchShop();
        } catch (error) {
            console.log('edit error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleCancel = () => {
        setEditMode('');
        setShowEditModal(false);
        setEditData(null);
    };

    const handleDelete = async (shopId: string) => {
        setIsLoadingAction(true);
        try {
            await deleteShopInFB(shopId);
            // await fetchShop();
        } catch (error) {
            console.log('delete error')
        } finally {
            setIsLoadingAction(false);
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <p className="flex-shrink-0 whitespace-nowrap">Approval Status:</p>
                    <SingleSelect
                        options={filterOptions}
                        value={filterSelected}
                        onChange={setFilterSelected}
                        placeholder="Filter shops"
                        backgroundColor='var(--color-contrast)'
                        width={150}
                    />
                    <p className="flex-shrink-0 whitespace-nowrap">Show columns:</p>
                    <MultiSelect<BaseSelectOptionType>
                        options={labelOptions}
                        selected={selectedVisableLabels}
                        setSelected={setSelectedVisableLabels}
                        backgroundColor='var(--color-contrast)'
                        showDeleteAllBtn={false}
                        maxToShow={1}
                        minWidth={300}
                    />
                </div>
                <button
                    onClick={() => openAdd()}
                    className="flex items-center justify-center bg-highlight text-contrast rounded-full px-2 py-2 sm:mr-2 hover:opacity-90 w-10 h-10 sm:w-auto sm:h-auto"
                >
                    <FaPlus size={16} />
                    <span className="hidden sm:inline-block ml-2">Add Shop</span>
                </button>
            </div>

            {isLoading ? <LoadingOverlay /> : allShops.length ? (
                <ShopTable
                    shops={filtershops}
                    visableLabelKeys={selectedVisableLabels.map(n => n.value)}
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