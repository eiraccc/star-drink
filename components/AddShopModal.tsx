'use client';
import { useEffect } from "react";
import Modal from "./Modal";
import { ShopSubmittedType } from "../types/shop";
import LoadingOverlay from "./LoadingOverlay";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAddShop } from "../services/shopClientNew";

interface propsType {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (_newId: string, _newName: string) => void;
}

type FormType = Omit<ShopSubmittedType, 'submittedBy'>;

const AddShopModal = ({isOpen, onClose, onAdd }: propsType) => {
    const addShopMutation = useAddShop();

    const handleAddShop = async(submittedData: FormType) => {
        addShopMutation.mutate({
            ...submittedData,
            submittedBy: 'test_user',
            submittedByRole: 'user'
        }, {
            onSuccess: (newId) => {
                onAdd(newId, submittedData.submittedName);
                toast.success('Shop added successfully! Please wait for admin approval.');
            },
            onError: (err) => {
                console.log('add shop error', err);
                toast.error("Failed to add shop. Please try again.");
            },
        });
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<FormType>({ mode: "onBlur" });


    // reset form valid when open th modal
    useEffect(() => reset(), [isOpen, reset]);

    return (<>
        {addShopMutation.isPending && <LoadingOverlay />}
        <Modal
            isOpen={isOpen}
            title='Add Shop'
            onClose={onClose}
            maxWidth={500}
        >
            <form onSubmit={handleSubmit(handleAddShop)}>
                <div className="mb-2 w-full">
                    <label
                        htmlFor="submittedName"
                        className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                    >Shop Name:</label>
                    <input
                        {...register("submittedName", { required: true })}
                        className={`w-full border-2 rounded-full py-1 bg-transparent p-2 focus:outline-none ${
                            errors.submittedName ? 'border-danger' : 'border-primary'}
                        `}
                    />
                    {errors.submittedName && (
                        <p className="text-danger text-sm ml-2">This field is required</p>
                    )}
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="submittedNote"
                        className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                    >Shop Note:</label>
                    <textarea
                        id="submittedNote"
                        {...register("submittedNote", { required: true })}
                        placeholder="e.g. Located near MRT, blue sign, Google link..."
                        className={`w-full border-2 rounded-xl py-1 bg-transparent p-2 focus:outline-none placeholder-surface ${
                            errors.submittedNote ? 'border-danger' : 'border-primary'}
                        `}
                    />
                    {errors.submittedNote && (
                        <p className="text-danger text-sm ml-2">This field is required</p>
                    )}

                    <p className="text-xs text-primary mb-4 ml-2">
                        Notes help admins verify the shop information.
                    </p>
                </div>
                <div className="flex gap-2 mt-4">
                    <button
                        className="w-1/2 px-4 py-2 border rounded-md text-sm text-text-secondary border-text-secondary hover:bg-background"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="w-1/2 px-4 py-2 rounded-md text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
            </form>
        </Modal>
    </>)
}

export default AddShopModal