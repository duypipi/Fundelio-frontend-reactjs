import { useState } from "react"
import RewardList from "../rewards/RewardList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"

export default function RewardTiersTab({ state, dispatch, setIsEditing }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [previewReward, setPreviewReward] = useState(null)

  const handleCreate = () => {
    setEditingReward(null)
    setPreviewReward(null)
    setIsFormOpen(true)
    setIsEditing?.(true)
  }

  const handleEdit = (reward) => {
    setEditingReward(reward)
    setPreviewReward(null)
    setIsFormOpen(true)
    setIsEditing?.(true)
  }

  const handleSave = (reward) => {
    if (editingReward) {
      dispatch({ type: "UPDATE_REWARD", payload: reward })
    } else {
      dispatch({ type: "ADD_REWARD", payload: reward })
    }
    setIsFormOpen(false)
    setEditingReward(null)
    setPreviewReward(null)
    setIsEditing?.(false)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingReward(null)
    setPreviewReward(null)
    setIsEditing?.(false)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa phần thưởng này?")) {
      dispatch({ type: "DELETE_REWARD", payload: id })
    }
  }

  const handleDuplicate = (id) => {
    dispatch({ type: "DUPLICATE_REWARD", payload: id })
  }

  // Update preview when form changes
  const handleFormChange = (reward) => {
    setPreviewReward(reward)
  }

  return (
    <div>
      {!isFormOpen ? (
        <RewardList
          rewards={state.rewards}
          items={state.items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onCreate={handleCreate}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Column */}
          <div className="flex-1">
            <RewardForm
              reward={editingReward}
              items={state.items}
              rewards={state.rewards}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleFormChange}
            />
          </div>

          {/* Preview Column */}
          <div className="lg:w-96">
            <RewardPreview reward={previewReward || editingReward} items={state.items} />
          </div>
        </div>
      )}
    </div>
  )
}
