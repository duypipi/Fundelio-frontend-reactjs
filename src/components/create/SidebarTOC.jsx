/**
 * SidebarTOC component - Table of contents sidebar
 * @param {Object} props
 * @param {Array} props.blanks - Array of blank objects
 * @param {Function} props.onAddBlank - Callback to add new blank
 * @param {Function} props.onNavigate - Callback when clicking on a TOC item
 */
export default function SidebarTOC({ blanks, onAddBlank, onNavigate }) {
  return (
    <aside className="md:sticky md:top-3 self-start bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-3 max-h-[calc(100vh-24px)] overflow-auto">
      <h3 className="mx-2 my-1.5 mb-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Mục lục
      </h3>

      <div className="space-y-2">
        {blanks.map((blank) => (
          <div
            key={blank.id}
            className="flex gap-2 items-center px-1.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => onNavigate(blank.id)}
          >
            <div className="flex-1 text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
              {blank.titleText || 'Untitled'}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddBlank}
        className="flex items-center justify-center w-full py-2.5 mt-2 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-black hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          + Thêm blank
        </span>
      </button>

      <div className="mt-2 px-1.5 text-xs text-gray-500 dark:text-gray-400">
        • Click vào tiêu đề để cuộn tới blank
      </div>
    </aside>
  );
}
