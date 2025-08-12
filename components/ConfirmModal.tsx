'use client';
import Modal from "./Modal"

type propsType = {
    isOpen: boolean,
    title: string,
    message: string,
    onCancel: () => void,
    onConfirm: () => void;
};

const ConfirmModal = ({ isOpen, title, message, onCancel, onConfirm }: propsType) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onCancel}
        title={title}
        maxWidth={400}
    >
        <p>{ message }</p>
        <div className="flex justify-end space-x-4 mt-4 text-sm">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-background hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-danger text-white hover:opacity-80"
          >
            Confirm
          </button>
        </div>
    </Modal>
  )
};

export default ConfirmModal;