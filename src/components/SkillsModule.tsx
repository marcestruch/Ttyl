// components/SkillsModule.tsx
import React, { useState } from 'react';
import { SkillsList } from './SkillsList';
import { SkillsRadar } from './SkillsRadar';

export const SkillsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'list'>('radar');

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 relative">
      {/* Header */}
      <header className="px-8 pt-12 pb-6 shrink-0 border-b border-border/50">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Skills & Competencias
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <span>Visualiza tu progreso y planifica tu crecimiento profesional</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 py-4 border-b border-border/50">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'radar'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 bg-transparent text-foreground hover:bg-accent'
            }`}
          >
            📊 Gráfico Radar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
              activeTab === 'list'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 bg-transparent text-foreground hover:bg-accent'
            }`}
          >
            📋 Mis Skills
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-8 py-8 pb-40">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'radar' && <SkillsRadar />}
          {activeTab === 'list' && <SkillsList />}
        </div>
      </main>
    </div>
  );
};
