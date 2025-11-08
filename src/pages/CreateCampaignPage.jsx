import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import useBlanks from '@/hooks/useBlanks';
import CreateCampaignTabs from '@/components/campaign/create/CreateCampaignTabs';
import CreateCampaignHeader from '@/components/common/CreateCampaignHeader';
import Footer from '@/components/common/Footer';
import { generatePreviewId, savePreviewData } from '@/utils/previewStorage';
import { setBasics, initializeStory, resetCampaign } from '@/store/campaignSlice';
import { campaignApi } from '@/api/campaignApi';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams(); // Get campaignId from URL if editing
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Get initial tab from URL query param or default to 'basic'
  const initialTab = searchParams.get('tab') || 'basic';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);

  const isEditMode = Boolean(campaignId);

  // Get data from Redux
  const basicsData = useSelector((state) => state.campaign.basics);
  const rewardsData = useSelector((state) => state.campaign.rewards);

  // Story state management (using Redux via useBlanks hook)
  const {
    blanks,
    activeEditorRef,
    addBlank,
    updateTitle,
    updateContent,
    reorderBlanks,
    deleteBlank,
    setActiveEditor,
    scrollToBlank,
    save,
  } = useBlanks();

  // Load campaign data if editing
  useEffect(() => {
    const loadCampaignData = async () => {
      if (!campaignId) {
        // Reset Redux when creating new campaign
        dispatch(resetCampaign());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await campaignApi.getCampaignById(campaignId);

        if (response?.data?.data) {
          const campaignData = response.data.data;
          setCampaign(campaignData);

          console.log('API Campaign Data:', campaignData);
          console.log('Category from API:', campaignData.category);

          // Load Basics
          const basicsData = {
            title: campaignData.title || '',
            description: campaignData.description || '',
            goalAmount: campaignData.goalAmount || 0,
            category: campaignData.category ? campaignData.category.toLowerCase() : '',
            introVideoUrl: campaignData.introVideoUrl || null,
            startTime: campaignData.startTime ? campaignData.startTime.split('T')[0] : '',
            endTime: campaignData.endTime ? campaignData.endTime.split('T')[0] : '',
            acceptedTerms: true,
          };

          console.log('Basics Data to Redux:', basicsData);
          dispatch(setBasics(basicsData));

          // Load Story
          if (campaignData.campaignSections && campaignData.campaignSections.length > 0) {
            const sections = campaignData.campaignSections;
            sections.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            const blanksById = {};
            const order = [];

            sections.forEach((section, index) => {
              const blankId = section.campaignSectionId;
              blanksById[blankId] = {
                id: blankId,
                order: section.orderIndex || index,
                titleHtml: section.formatTitle || section.tabTitle || '',
                titleText: section.tabTitle || '',
                contentHtml: section.itemData || '',
              };
              order.push(blankId);
            });

            dispatch(initializeStory({ blanksById, order }));
          }

          console.log('Loaded campaign data into Redux');
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        toast.error('Không thể tải thông tin chiến dịch');
      } finally {
        setLoading(false);
      }
    };

    loadCampaignData();
  }, [campaignId, dispatch]);

  const handleAddBlank = () => {
    const newId = addBlank();
    // Wait for DOM update then scroll
    setTimeout(() => scrollToBlank(newId), 100);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL with tab query param if in edit mode
    if (isEditMode) {
      navigate(`/campaigns/${campaignId}/edit?tab=${tabId}`, { replace: true });
    }
  };

  const handleSaveStory = async () => {
    if (!isEditMode || !campaignId) {
      save(); // Just save to Redux if not in edit mode
      return;
    }

    try {
      save(); // Save to Redux first
      toast.loading('Đang lưu câu chuyện...', { id: 'save-story' });

      const sectionsToCreate = [];
      const sectionsToUpdate = [];
      const existingSectionIds = campaign?.campaignSections?.map(s => s.campaignSectionId) || [];

      blanks.forEach((blank, index) => {
        const sectionData = {
          tabTitle: blank.titleText || `Section ${index + 1}`,
          formatTitle: blank.titleHtml || blank.titleText || `<p>Section ${index + 1}</p>`,
          itemData: blank.contentHtml || '',
          orderIndex: index,
        };

        if (existingSectionIds.includes(blank.id)) {
          sectionsToUpdate.push({ sectionId: blank.id, data: sectionData });
        } else {
          sectionsToCreate.push(sectionData);
        }
      });

      // Create new sections
      for (const sectionData of sectionsToCreate) {
        await campaignApi.createCampaignSection(campaignId, sectionData);
      }

      // Update existing sections
      for (const { sectionId, data } of sectionsToUpdate) {
        await campaignApi.updateCampaignSection(campaignId, sectionId, data);
      }

      // Delete removed sections
      const currentBlankIds = blanks.map(b => b.id);
      const sectionsToDelete = existingSectionIds.filter(id => !currentBlankIds.includes(id));

      for (const sectionId of sectionsToDelete) {
        await campaignApi.deleteCampaignSection(campaignId, sectionId);
      }

      toast.success('Lưu câu chuyện thành công!', { id: 'save-story' });

      // Reload campaign data
      const response = await campaignApi.getCampaignById(campaignId);
      if (response?.data?.data) {
        setCampaign(response.data.data);
      }
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu câu chuyện', { id: 'save-story' });
    }
  };

  const handlePreview = () => {
    // Validate basics data
    if (!basicsData || !basicsData.title || !basicsData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin cơ bản (Tiêu đề và Mô tả)');
      setActiveTab('basic');
      return;
    }

    // Collect all campaign data from Redux
    const campaignData = {
      // Basics
      basics: basicsData,

      // Story
      story: {
        blanks: blanks.map((blank, index) => ({
          id: blank.id,
          order: index,
          title_text: blank.titleText,
          title_html: blank.titleHtml,
          content_html: blank.contentHtml,
        })),
      },

      // Rewards - send complete rewards object
      rewards: {
        rewards: rewardsData.rewards || [],
        addOns: rewardsData.addOns || [],
        items: rewardsData.items || [],
      },
    };

    // Generate unique preview ID
    const previewId = generatePreviewId();

    // Save to sessionStorage (will automatically handle large images)
    const saved = savePreviewData(previewId, campaignData);

    if (!saved) {
      toast.error('Không thể lưu dữ liệu preview. Vui lòng thử lại.');
      return;
    }

    // Navigate with full state including images (for immediate access)
    navigate(`/campaigns/preview/${previewId}`, {
      state: { campaignData, isPreview: true },
    });

    toast.success('Đang chuyển đến trang xem trước...');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f6f8ff] dark:bg-darker transition-colors duration-300">
        {/* New Header with Tabs */}
        <CreateCampaignHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onPreview={handlePreview}
          isEditMode={isEditMode}
          campaignId={campaignId}
        />

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div
            className="w-full mx-auto px-4 sm:px-20 pt-36 md:pt-24 pb-12"
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
              onReorderBlanks={reorderBlanks}
              onDeleteBlank={deleteBlank}
              setActiveEditor={setActiveEditor}
              scrollToBlank={scrollToBlank}
              save={handleSaveStory}
              campaignId={campaignId}
              isEditMode={isEditMode}
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
