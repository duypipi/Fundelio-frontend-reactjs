import { useState, useMemo } from "react"
import Button from "./button"
import Input from "./input"

export default function ItemSelector({ items, selectedItems, onConfirm, onClose }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelected, setLocalSelected] = useState(selectedItems)

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [items, searchTerm])

  const handleQtyChange = (itemId, qty) => {
    if (qty <= 0) {
      setLocalSelected((prev) => prev.filter((item) => item.itemId !== itemId))
    } else {
      setLocalSelected((prev) => {
        const existing = prev.find((item) => item.itemId === itemId)
        if (existing) {
          return prev.map((item) => (item.itemId === itemId ? { ...item, qty } : item))
        } else {
          return [...prev, { itemId, qty }]
        }
      })
    }
  }

  const handleConfirm = () => {
    onConfirm(localSelected)
  }

  return (
    <div className="fixed inset-0 bg-darker-2-light/50 flex items-end z-50">
      <div className="w-full bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Chọn thành phần</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">
            ×
          </button>
        </div>

        <Input
          type="text"
          placeholder="Tìm kiếm thành phần..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-3 mb-6">
          {filteredItems.map((item) => {
            const selected = localSelected.find((s) => s.itemId === item.id)
            return (
              <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-sm">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQtyChange(item.id, (selected?.qty || 0) - 1)}
                    className="px-2 py-1 text-muted-foreground hover:text-foreground"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={selected?.qty || 0}
                    onChange={(e) => handleQtyChange(item.id, Number.parseInt(e.target.value) || 0)}
                    className="w-12 text-center border border-border rounded px-2 py-1 bg-background text-foreground"
                    min="0"
                  />
                  <button
                    onClick={() => handleQtyChange(item.id, (selected?.qty || 0) + 1)}
                    className="px-2 py-1 text-muted-foreground hover:text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Hủy
          </Button>
          <Button onClick={handleConfirm} variant="primary" className="flex-1">
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  )
}
