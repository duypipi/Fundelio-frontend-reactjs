import { useState } from "react"
import AddOnList from "../addons/AddOnList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"

export default function AddOnsTab({ state, dispatch }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddOn, setEditingAddOn] = useState(null)
  const [previewAddOn, setPreviewAddOn] = useState(null)

  const handleCreate = () => {
    setEditingAddOn(null)
    setPreviewAddOn(null)
    setIsFormOpen(true)
  }

  const handleEdit = (addon) => {
    setEditingAddOn(addon)
    setPreviewAddOn(null)
    setIsFormOpen(true)
  }

  const handleSave = (addon) => {
    if (editingAddOn) {
      dispatch({ type: "UPDATE_ADDON", payload: addon })
    } else {
      dispatch({ type: "ADD_ADDON", payload: addon })
    }
    setIsFormOpen(false)
    setEditingAddOn(null)
    setPreviewAddOn(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingAddOn(null)
    setPreviewAddOn(null)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa add-on này?")) {
      dispatch({ type: "DELETE_ADDON", payload: id })
    }
  }

  const handleFormChange = (addon) => {
    setPreviewAddOn(addon)
  }

  return (
    <div>
      {!isFormOpen ? (
        <AddOnList
          addOns={state.addOns}
          items={state.items}
          rewards={state.rewards}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Column */}
          <div className="flex-1">
            <RewardForm
              reward={editingAddOn}
              items={state.items}
              rewards={state.rewards}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleFormChange}
              type="addon"
            />
          </div>

          {/* Preview Column */}
          <div className="lg:w-96">
            <RewardPreview 
              reward={previewAddOn || editingAddOn} 
              items={state.items}
              rewards={state.rewards}
              type="addon"
            />
          </div>
        </div>
      )}
    </div>
  )
}
