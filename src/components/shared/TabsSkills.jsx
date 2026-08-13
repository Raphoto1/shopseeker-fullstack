'use client';

import React, { useId, useState } from "react";

export default function TabsSkills(props) {
  const tabsGroupName = useId();
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { key: "general", label: props.Title, content: props.GeneralContent },
    { key: "skills", label: "Skills", content: props.SkillsContent },
    { key: "projects", label: "Projects", content: props.ProjectsContent },
  ];

  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className='w-full max-h-fit md:max-h-96 rounded-lg'>
      <div className='w-full h-full min-h-0 flex flex-col'>
        <div role='tablist' aria-label={tabsGroupName} className='flex items-end gap-1 shrink-0'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type='button'
              role='tab'
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-sm rounded-t-lg max-w-[8.5rem] sm:max-w-[10rem] truncate transition-colors ${
                activeTab === tab.key ? `${props.activeBg} text-slate-100` : `${props.inactiveBg} text-slate-500 hover:text-slate-700`
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div role='tabpanel' className={`flex-1 min-h-0 w-full rounded-b-lg rounded-tr-lg p-4 overflow-y-auto ${props.activeBg} transition-all duration-300 ease-out motion-safe:animate-[fadeIn_0.25s_ease-out]`}>
          {activeContent}
        </div>
      </div>
    </div>
  );
}
