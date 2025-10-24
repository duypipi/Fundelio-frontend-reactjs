import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import CreateCampaignTabs from '@/components/create/CreateCampaignTabs';
import CreateCampaignHeader from '@/components/common/CreateCampaignHeader';
import Footer from '@/components/common/Footer';

export default function CreateCampaignPage() {
  const [activeTab, setActiveTab] = useState('story');
  const [isEditing, setIsEditing] = useState(false);

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePreview = () => {
    console.log('Preview campaign');
    // TODO: Implement preview functionality
  };

  const handleCancel = () => {
    console.log('Cancel editing');
    setIsEditing(false);
    // TODO: Reset form or discard changes
  };

  const handleSave = () => {
    console.log('Save changes');
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-black transition-colors duration-300">
        {/* New Header with Tabs */}
        <CreateCampaignHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPreview={handlePreview}
          isEditing={isEditing}
          onCancel={handleCancel}
          onSave={handleSave}
        />

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div
            className="w-full mx-auto px-4 sm:px-6 pt-36 md:pt-24 pb-12"
            style={{ maxWidth: 'var(--max-width-container)' }}
          >
            <CreateCampaignTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              blanks={blanks}
              activeEditorRef={activeEditorRef}
              onAddBlank={handleAddBlank}
              onTitleChange={updateTitle}
              onContentChange={updateContent}
              setActiveEditor={setActiveEditor}
              scrollToBlank={scrollToBlank}
              save={save}
              setIsEditing={setIsEditing}
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
