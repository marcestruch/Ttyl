// components/SkillsList.tsx
import React, { useState } from 'react';
import { useSkillsStore } from '../store/skillsStore';
import { Skill } from '../types/skills';
import { SkillForm } from './SkillForm';

export const SkillsList: React.FC = () => {
  const { skills, deleteSkill } = useSkillsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'recent'>('name');

  const categoryLabels = {
    frontend: '💻 Frontend',
    backend: '🔧 Backend',
    devops: '⚙️ DevOps',
    design: '🎨 Design',
    soft: '💬 Soft Skills',
    other: '📌 Otros',
  };

  const categoryColors = {
    frontend: '#378ADD',
    backend: '#D85A30',
    devops: '#0F6E56',
    design: '#D4537E',
    soft: '#BA7517',
    other: '#5F5E5A',
  };

  const getSortedSkills = () => {
    const sorted = [...skills];
    switch (sortBy) {
      case 'proficiency':
        return sorted.sort((a, b) => b.proficiency - a.proficiency);
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  if (showForm) {
    return <SkillForm onClose={handleCloseForm} editingSkill={editingSkill || undefined} />;
  }

  const sortedSkills = getSortedSkills();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-lg font-medium text-foreground m-0">
          Mis Skills ({skills.length})
        </h2>
        <button
          onClick={() => {
            setEditingSkill(null);
            setShowForm(true);
          }}
          className="px-4 py-2 rounded-md border border-border/50 bg-primary/10 text-primary font-medium text-sm transition-colors hover:bg-primary/20"
        >
          + Añadir Skill
        </button>
      </div>

      {/* Sort */}
      <div className="flex gap-1.5 mb-6">
        {(['name', 'proficiency', 'recent'] as const).map(sort => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              sortBy === sort
                ? 'border-primary bg-accent text-foreground'
                : 'border-border/50 bg-transparent text-foreground hover:bg-accent/50'
            }`}
          >
            {sort === 'name' && 'Nombre'}
            {sort === 'proficiency' && 'Proficiency'}
            {sort === 'recent' && 'Reciente'}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {sortedSkills.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
          <p className="text-sm m-0">
            No tienes skills aún. ¡Añade uno para empezar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedSkills.map(skill => (
            <div
              key={skill.id}
              className="bg-card border border-border/50 rounded-lg p-4 transition-all hover:shadow-md hover:border-border"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[15px] font-medium m-0 mb-1 text-foreground">
                    {skill.name}
                  </h3>
                  <span 
                    className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                    style={{
                      background: categoryColors[skill.category] + '20',
                      color: categoryColors[skill.category],
                    }}
                  >
                    {categoryLabels[skill.category as keyof typeof categoryLabels]}
                  </span>
                </div>
              </div>

              {/* Proficiency */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Proficiency
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${skill.proficiency}%`,
                      background: categoryColors[skill.category],
                    }}
                  />
                </div>
              </div>

              {/* Target */}
              {skill.targetProficiency && skill.targetProficiency > skill.proficiency && (
                <div className="text-xs text-muted-foreground mb-4">
                  Meta: {skill.targetProficiency}%
                </div>
              )}

              {/* Notas */}
              {skill.notes && (
                <p className="text-xs text-muted-foreground m-0 mb-4 italic">
                  "{skill.notes}"
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="flex-1 py-1.5 px-3 rounded-md border border-border/50 bg-transparent text-foreground text-xs font-medium transition-colors hover:bg-accent"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="flex-1 py-1.5 px-3 rounded-md border border-border/50 bg-transparent text-destructive text-xs font-medium transition-colors hover:bg-destructive/10 hover:border-destructive/30"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
