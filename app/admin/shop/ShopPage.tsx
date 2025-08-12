'use client';
import React, { useEffect, useState, useMemo } from "react"
import { ShopType, ShopFormType } from "../../../types/shop";
import {
    addShop as addShopToFB,
    editShop as editShopToFB,
    deleteShop as deleteShopInFB,
    approveShop
} from "../../../services/shopClient";
import { BaseSelectOptionType } from "../../../types/selectOptionType";
import SingleSelect from "../../../components/SingleSelect";
import MultiSelect from "../../../components/MultiSelect";
import ShopTable from "./ShopTable";
import ShopEditModal from "./ShopEditModal";
import LoadingOverlay from "../../../components/LoadingOverlay";
import LoadingSection from "../../../components/LoadingSection";
import ErrorSection from "../../../components/ErrorSection";
import ConfirmModal from "../../../components/ConfirmModal";
import { FaPlus } from 'react-icons/fa';
import { shopColumns, typeToInitColumnsMap, ApprovalStatusType } from "../../../constants/shopColumnConfig";
import { toast } from 'react-toastify';
import { fetchShops } from "../../../services/shopClient";

const ShopPage = ({ initAllShops }: { initAllShops: ShopType[] }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<'edit' | 'add' | ''>('');
    const [allShops, setAllShops] = useState<ShopType[]>(initAllShops);
    const [errorAll, setErrorAll] = useState<Error | null>(null);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        (async () => {
            try {
              unsubscribe = (await fetchShops({
                mode: 'subscribe',
                callback: (shops) => {
                  setAllShops(shops as ShopType[]);
                  setErrorAll(null);
                },
                errorCallback: (error) => setErrorAll(error),
              })) as () => void;
            } catch (error) {
              setErrorAll(error as Error);
            }
        })();
        
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useEffect(() => {
        console.log('error', errorAll);
    }, [errorAll]);

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
  
    const labelOptions = useMemo(() => 
        shopColumns.map(n => ({
            value: n.key,
            label: n.label
        })), []
    );
    const [selectedVisableLabels, setSelectedVisableLabels] = useState<BaseSelectOptionType[]>([]);
    
    useEffect(() => {
        setSelectedVisableLabels(labelOptions.filter(n => {
            return typeToInitColumnsMap[filterType].includes(n.value);
        }));
    }, [filterType, labelOptions]);


    const checkKeys: (keyof ShopType)[] = ['nameEn', 'nameZh', 'slug', 'description'];

    const checkApproveValid = (data: ShopType) => {
        return checkKeys.every(key => data[key] !== '') && data.alias.length > 0
    }

    const getApproveInvalidKey = (data: ShopType) => {
        const invalidKeys = checkKeys.filter(key => data[key] === '');
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
            const {createdAt: _createdAt, ...editItem} = editData as ShopType;
            await editShopToFB(editItem);
            setEditMode('');
            setShowEditModal(false);
            setEditData(null);
            toast.success('Shop edited successfully!');
            // await fetchShop();
        } catch (error) {
            console.log('edit error', error);
            toast.error("Failed to edit shop. Please try again.");
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
            toast.success('Shop added successfully!');
            // await fetchShop();
        } catch (error) {
            console.log('edit error', error);
            toast.error("Failed to add shop. Please try again.");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleCancel = () => {
        setEditMode('');
        setShowEditModal(false);
        setEditData(null);
    };
    

    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [deleteShopId, setDeleteShopId] = useState<string>('');

    const checkDelete = (shopId: string) => {
        setDeleteShopId(shopId);
        setShowDeleteConfirm(true);
    }

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        if(!deleteShopId) return;

        setIsLoadingAction(true);
        try {
            await deleteShopInFB(deleteShopId);
            toast.success('Shop deleted successfully!');
            // await fetchShop();
        } catch (error) {
            console.log('delete error', error);
            toast.error("Failed to delete shop. Please try again.");
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
           <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Confirm Delete?"
                message="Are you sure you want to delete this item?"
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setDeleteShopId('');
                }}
                onConfirm={handleDelete}
            />
           
            {isClient && <div className="flex justify-between p-2">
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
            </div>}

            {isLoadingAction && <LoadingOverlay />}

            {!isClient ? <LoadingSection /> : allShops.length ? (
                <ShopTable
                    shops={filtershops}
                    visableLabelKeys={selectedVisableLabels.map(n => n.value)}
                    handleApprove={handleApprove}
                    openEdit={openEdit}
                    handleDelete={checkDelete}
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