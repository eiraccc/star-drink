import { useState } from "react";
import Modal from "./Modal";
import { ShopSubmittedType } from "../types/shop";
import { addShopByName } from "../utils/shopService";
import LoadingOverlay from "./LoadingOverlay";
import { toast } from 'react-toastify';

interface propsType {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newId: string, newName: string) => void;
}

const AddShopModal = ({isOpen, onClose, onAdd }: propsType) => {
    const initData = {
        submittedName: '',
        submittedNote: '',
        submittedBy: 'test_user',
    };
    const [submittedData, setSubmittedData] = useState<ShopSubmittedType>(initData);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleAddShop = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(!submittedData.submittedName || !submittedData.submittedNote) return;
        setIsLoading(true);
        try {
            const newId = await addShopByName(submittedData);
            onAdd(newId, submittedData.submittedName);
            toast.success('Shop added successfully! Please wait for admin approval.');
        } catch (error) {
            console.log('add shop error')
            toast.error("Failed to add shop. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (<>
        {isLoading && <LoadingOverlay />}
        <Modal
            isOpen={isOpen}
            title='Add Shop'
            onClose={onClose}
            maxWidth={500}
        >
            <div className="mb-2 w-full">
                <label
                    htmlFor="shopName"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
                >Shop Name:</label>
                <input
                    type="text"
                    id="shopName"
                    className='w-full border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
                    value={ submittedData.submittedName }
                    onChange={(e) => setSubmittedData({...submittedData, submittedName: e.target.value})}
                    required
                />
            </div>
            <div className="mb-2">
                <label
                    htmlFor="shopNote"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
                >Shop Note:</label>
                <textarea
                    id="shopNote"
                    className='w-full border-2 border-primary rounded-xl py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary placeholder-surface'
                    value={ submittedData.submittedNote }
                    onChange={(e) => setSubmittedData({...submittedData, submittedNote: e.target.value})}
                    placeholder='e.g. Located near MRT, blue sign, Google link...'
                    required
                />
                <p className="text-xs text-primary mb-4 ml-2">
                    Notes help admins verify the shop information.
                </p>
            </div>
            <div className="flex gap-2 mt-4">
                 <button
                     className="w-1/2 px-4 py-2 border rounded-lg text-sm text-text-secondary border-text-secondary hover:bg-surface"
                     onClick={() => onClose()}
                 >
                     Cancel
                 </button>
                 <button
                     className="w-1/2 px-4 py-2 rounded-lg text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50"
                     onClick={(e) => handleAddShop(e)}
                 >
                     Add
                 </button>
             </div>
        </Modal>
    </>)
}

export default AddShopModal