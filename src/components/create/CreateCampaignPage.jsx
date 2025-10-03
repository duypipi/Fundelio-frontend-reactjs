import { useState, useRef, useEffect, useCallback } from 'react';
import { uid } from '../../utils/id';
import StoryToolbar from './StoryToolbar';
import SidebarTOC from './SidebarTOC';
import BlankSection from './BlankSection';

/**
 * Custom hook to manage blanks state and operations
 */
function useBlanks() {
  const [blanks, setBlanks] = useState([]);
  const activeEditorRef = useRef(null);
  const autosaveTimerRef = useRef(null);

  // Initialize with first blank
  useEffect(() => {
    const firstId = uid();
    setBlanks([
      {
        id: firstId,
        order: 0,
        titleHtml: 'Giới thiệu',
        titleText: 'Giới thiệu',
        contentHtml: '<p>Gõ nội dung câu chuyện dự án ở đây…</p>',
      },
    ]);
  }, []);

  const addBlank = () => {
    const newId = uid();
    const newBlank = {
      id: newId,
      order: blanks.length,
      titleHtml: 'Untitled',
      titleText: 'Untitled',
      contentHtml: '',
    };
    setBlanks((prev) => [...prev, newBlank]);
    return newId;
  };

  const updateTitle = useCallback((id, titleHtml, titleText) => {
    setBlanks((prev) =>
      prev.map((blank) =>
        blank.id === id ? { ...blank, titleHtml, titleText } : blank
      )
    );
    scheduleAutosave();
  }, []);

  const updateContent = useCallback((id, contentHtml) => {
    setBlanks((prev) =>
      prev.map((blank) => (blank.id === id ? { ...blank, contentHtml } : blank))
    );
    scheduleAutosave();
  }, []);

  const setActiveEditor = (_id, editor) => {
    activeEditorRef.current = editor;
  };

  const scrollToBlank = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const blank = blanks.find((b) => b.id === id);
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
      blanks: blanks.map((blank, index) => ({
        id: blank.id,
        order: index,
        title_text: blank.titleText,
        title_html: blank.titleHtml,
        content_html: blank.contentHtml,
      })),
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
    alert(
      'Đã log ra console nội dung các blank (HTML). Khuyến nghị sanitize trước khi lưu.'
    );
  };

  return {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    setActiveEditor,
    scrollToBlank,
    save,
  };
}

/**
 * CreateCampaignPage - Main page component for creating campaign stories
 */
export default function CreateCampaignPage() {
  const {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    setActiveEditor,
    scrollToBlank,
    save,
  } = useBlanks();

  const handleAddBlank = () => {
    const newId = addBlank();
    // Wait for DOM update then scroll
    setTimeout(() => scrollToBlank(newId), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 p-4">
        {/* Sidebar */}
        <SidebarTOC
          blanks={blanks}
          onAddBlank={handleAddBlank}
          onNavigate={scrollToBlank}
        />

        {/* Main Content */}
        <main className="max-w-[980px] mx-auto w-full">
          {/* Toolbar */}
          <StoryToolbar activeEditorRef={activeEditorRef} onSave={save} />

          {/* Blanks */}
          <div>
            {blanks.map((blank) => (
              <BlankSection
                key={blank.id}
                blank={blank}
                onTitleChange={updateTitle}
                onContentChange={updateContent}
                onFocus={setActiveEditor}
              />
            ))}
          </div>

          {/* Add Blank Button at Bottom */}
          <button
            onClick={handleAddBlank}
            className="flex items-center justify-center w-full py-2.5 mb-5 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-black hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              + Thêm blank
            </span>
          </button>
        </main>
      </div>
    </div>
  );
}
