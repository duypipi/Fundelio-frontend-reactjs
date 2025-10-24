// import { useState } from 'react';
// import { Gift, Plus, Zap } from 'lucide-react';
// import { useRewardsState } from '@/hooks/useRewardsState';
// import RewardsTab from './tabs/RewardsTab';
// import AddOnsTab from './tabs/AddOnsTab';
// import ComponentsTab from './tabs/ComponenstTab';

// /**
//  * RewardsContent component - Main rewards management interface
//  * Contains 3 tabs: Rewards, Add-ons, Components
//  */
// export default function RewardsContent() {
//   const [activeTab, setActiveTab] = useState('rewards');
//   const { state, dispatch } = useRewardsState();

//   const tabs = [
//     {
//       id: 'rewards',
//       label: 'Phần thưởng',
//       icon: Gift,
//       component: RewardsTab,
//       count: state.rewards.length,
//     },
//     {
//       id: 'addons',
//       label: 'Add-ons',
//       icon: Plus,
//       component: AddOnsTab,
//       count: state.addOns.length,
//     },
//     {
//       id: 'components',
//       label: 'Thành phần',
//       icon: Zap,
//       component: ComponentsTab,
//       count: state.items.length,
//     },
//   ];

//   const activeTabConfig = tabs.find((t) => t.id === activeTab);
//   const TabComponent = activeTabConfig?.component;

//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="border-b border-gray-300 dark:border-gray-700">
//         <div className="flex gap-2 overflow-x-auto">
//           {tabs.map((tab) => {
//             const TabIcon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
//                 }`}
//               >
//                 <TabIcon className="w-5 h-5" />
//                 <span>{tab.label}</span>
//                 {tab.count > 0 && (
//                   <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
//                     {tab.count}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {TabComponent && (
//           <TabComponent state={state} dispatch={dispatch} />
//         )}
//       </div>
//     </div>
//   );
// }
