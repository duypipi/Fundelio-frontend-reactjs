import { useRef } from 'react';
import { buildVideoEmbed } from '../../utils/embed';

/**
 * StoryToolbar component - Editor toolbar with formatting options
 * @param {Object} props
 * @param {Object} props.activeEditorRef - Reference to currently active editor
 * @param {Function} props.onSave - Callback when save button is clicked
 */
export default function StoryToolbar({ activeEditorRef, onSave }) {
  const imgPickerRef = useRef(null);
  const colorInputRef = useRef(null);

  const execCommand = (command, value = null) => {
    if (!activeEditorRef.current) return;
    document.execCommand(command, false, value);
    activeEditorRef.current.focus();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');

  const handleH2 = () => {
    if (!activeEditorRef.current) return;
    const h2 = document.createElement('h2');
    h2.textContent = 'Tiêu đề cấp 2';
    h2.className = 'text-2xl font-bold mt-4 mb-2 dark:text-white';
    placeBlock(activeEditorRef.current, h2);
  };

  const handleLink = () => {
    if (!activeEditorRef.current) return;
    const url = prompt('Dán link YouTube/Vimeo hoặc URL:');
    if (!url) return;

    const iframe = buildVideoEmbed(url);
    if (iframe) {
      placeBlock(activeEditorRef.current, iframe);
    } else if (/^https?:\/\//i.test(url)) {
      execCommand('createLink', url);
    } else {
      alert('URL không hợp lệ.');
    }
  };

  const handleImagePicker = () => {
    imgPickerRef.current?.click();
  };

  const handleImageChange = (e) => {
    if (!activeEditorRef.current) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.className = 'max-w-full h-auto block mx-auto my-4 rounded-xl';
    placeBlock(activeEditorRef.current, img);

    // Reset input
    e.target.value = '';
  };

  const handleColorChange = (e) => {
    execCommand('foreColor', e.target.value);
  };

  const placeBlock = (editor, node) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        editor.appendChild(node);
        return;
      }
      range.collapse(false);
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editor.appendChild(node);
    }

    // Trigger input event to save changes
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div className="sticky top-3 z-10 flex gap-2 flex-wrap bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-2 mb-2.5">
      <button
        onClick={handleBold}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Bold"
      >
        B
      </button>

      <button
        onClick={handleItalic}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm italic hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Italic"
      >
        I
      </button>

      <button
        onClick={handleUnderline}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm underline hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Underline"
      >
        U
      </button>

      <button
        onClick={handleH2}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Heading 2"
      >
        H2
      </button>

      <button
        onClick={handleLink}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Add Link or Video"
      >
        Link
      </button>

      <button
        onClick={handleImagePicker}
        className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Upload Image/GIF"
      >
        Ảnh/GIF
      </button>

      <input
        ref={colorInputRef}
        type="color"
        onChange={handleColorChange}
        className="p-1 w-11 h-9 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg cursor-pointer"
        title="Text Color"
      />

      <button
        onClick={onSave}
        className="px-3 py-2 border border-primary bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors ml-auto"
        title="Save"
      >
        Lưu
      </button>

      <input
        ref={imgPickerRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
