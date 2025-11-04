import { useState, useRef, useEffect, useCallback } from 'react';
import { uid } from '@/utils/id';
import toast from 'react-hot-toast';
/**
 * Custom hook to manage blanks state and operations
 * Uses blanksById (Record<id, Blank>) and order (string[]) for stable reordering
 */
function useBlanks() {
  const [blanksById, setBlanksById] = useState({});
  const [order, setOrder] = useState([]);
  const activeEditorRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  // Initialize with first blank
  useEffect(() => {
    const firstId = uid();
    setBlanksById({
      [firstId]: {
        id: firstId,
        titleHtml: 'Giới thiệu',
        titleText: 'Giới thiệu',
        contentHtml: '<p>Gõ nội dung câu chuyện dự án ở đây…</p>',
      },
    });
    setOrder([firstId]);
  }, []);

  const addBlank = () => {
    const newId = uid();
    const newBlank = {
      id: newId,
      titleHtml: 'Untitled',
      titleText: 'Untitled',
      contentHtml: '',
    };
    setBlanksById((prev) => ({
      ...prev,
      [newId]: newBlank,
    }));
    setOrder((prev) => [...prev, newId]);
    return newId;
  };

  const updateTitle = useCallback((id, titleHtml, titleText) => {
    setBlanksById((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        titleHtml,
        titleText,
      },
    }));
    scheduleAutosave();
  }, []);

  const updateContent = useCallback((id, contentHtml) => {
    setBlanksById((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        contentHtml,
      },
    }));
    scheduleAutosave();
  }, []);

  const reorderBlanks = useCallback((newOrder) => {
    setOrder(newOrder);
    scheduleAutosave();
  }, []);

  const deleteBlank = useCallback((id) => {
    // Prevent deleting if it's the last blank
    if (order.length <= 1) {
      toast.error('Không thể xóa blank cuối cùng!');
      return;
    }

    // Remove from order
    setOrder((prev) => prev.filter((blankId) => blankId !== id));

    // Remove from blanksById
    setBlanksById((prev) => {
      const newBlanks = { ...prev };
      delete newBlanks[id];
      return newBlanks;
    });

    toast.success('Đã xóa blank thành công!');
    scheduleAutosave();
  }, [order.length]);

  const setActiveEditor = (_id, editor) => {
    activeEditorRef.current = editor;
  };

  const scrollToBlank = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const blank = blanksById[id];
        if (blank) {
          const editorElement = element.querySelector(
            '[contenteditable="true"]:last-child'
          );
          editorElement?.focus();
        }
      }, 350);
    }
  };

  const getPayload = () => {
    const payload = {
      version: 1,
      createdAt: new Date().toISOString(),
      blanks: order.map((id, index) => {
        const blank = blanksById[id];
        return {
          id: blank.id,
          order: index,
          title_text: blank.titleText,
          title_html: blank.titleHtml,
          content_html: blank.contentHtml,
        };
      }),
    };
    return payload;
  };

  const scheduleAutosave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      const payload = getPayload();
      console.log('[AUTOSAVE]', payload);
    }, 5000);
  };

  const save = () => {
    const payload = getPayload();
    console.log('SAVE payload:', payload);
    console.log('\n=== Mock Data JSON ===\n', JSON.stringify(payload, null, 2));
    toast.success('Đã lưu thành công!');
  };

  // Derive blanks array from order and blanksById for rendering
  const blanks = order.map((id) => blanksById[id]);

  return {
    blanks,
    blanksById,
    order,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    reorderBlanks,
    deleteBlank,
    setActiveEditor,
    scrollToBlank,
    save,
  };
}
export default useBlanks;

