import Modal from "../../../component/Modal";
import UnderlineInput from "../../../component/UnderlineInput";
import ChipInput from "../../../component/ChipInput";
import { ShopFormType } from "../../../types/shop";

interface propsType {
    isOpen: boolean;
    editMode: 'edit' | 'add' | '',
    editData: ShopFormType | null;
    setEditData: (data: ShopFormType) => void;
    onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onCancel: () => void;
}

const ShopEditModal = ({
    isOpen,
    editMode,
    editData,
    setEditData,
    onSave,
    onCancel,
}: propsType) => {
  return (
    <Modal
        title={editMode === 'edit' ? 'Edit Shop' : 'Add Shop'}
        isOpen={isOpen}
        onClose={() => onCancel()}>
            {editData &&(<div>
                <UnderlineInput
                    id="nameEn"
                    label="Name (English):"
                    defaultValue={editData.nameEn}
                    onChange={(e) => setEditData({ ...editData, nameEn: e.target.value })}
                    required
                />
                <UnderlineInput
                    id="nameZh"
                    label="Name (Chinese):"
                    defaultValue={editData.nameZh}
                    onChange={(e) => setEditData({ ...editData, nameZh: e.target.value })}
                    required
                />
                <UnderlineInput
                    id="slug"
                    label="Slug:"
                    defaultValue={editData.slug}
                    onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                    required
                />
                <div className="flex mb-3">
                    <label htmlFor="alias" className="w-[140px]">Alias:</label>
                    <ChipInput
                        defaultValue={editData.alias}
                        onChange={(newAliasList) => setEditData({ ...editData, alias: newAliasList })}
                        placeholder='Add alias, press Enter'
                    />
                </div>
                <div className="flex mb-3">
                    <p className="w-[140px]">Description:</p>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        className="flex-1 bg-contrast border border-surface rounded-md p-2 focus:outline-none focus:ring-primary focus:border-primary resize-none"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                </div>
                <div className="flex mb-3 mt-4">
                    <p className="w-[140px]">SubmittedName:</p>
                    <p className="flex-1 text-primary">{editData.submittedName || '-'}</p>
                </div>
                <div className="flex mb-3">
                    <p className="w-[140px]">SubmittedNote:</p>
                    <p className="flex-1 text-primary">{editData.submittedNote || '-'}</p>
                </div>
                <div className="flex mb-3">
                    <p className="w-[140px]">SubmittedBy:</p>
                    <p className="flex-1 text-primary">{editData.submittedBy || '-'}</p>
                </div>
                <div className="flex mb-3">
                    <p className="w-[140px]">SubmittedByRole:</p>
                    <p className="flex-1 text-primary">{editData.submittedByRole}</p>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        className="w-1/2 px-4 py-2 border rounded-md text-sm text-text-secondary border-text-secondary hover:bg-background"
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-1/2 px-4 py-2 rounded-md text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50"
                        onClick={(e) => onSave(e)}
                    >
                        Save
                    </button>
                </div>
            </div>)}
    </Modal>
  )
}

export default ShopEditModal