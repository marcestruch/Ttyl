// components/SkillForm.tsx
import React, { useState } from 'react';
import { useSkillsStore } from '../store/skillsStore';
import { Skill } from '../types/skills';

interface SkillFormProps {
  onClose?: () => void;
  editingSkill?: Skill;
}

export const SkillForm: React.FC<SkillFormProps> = ({ onClose, editingSkill }) => {
  const { addSkill, updateSkill } = useSkillsStore();
  const [formData, setFormData] = useState({
    name: editingSkill?.name || '',
    proficiency: editingSkill?.proficiency || 50,
    category: (editingSkill?.category || 'frontend') as Skill['category'],
    targetProficiency: editingSkill?.targetProficiency || 100,
    notes: editingSkill?.notes || '',
  });

  const categories: Skill['category'][] = ['frontend', 'backend', 'devops', 'design', 'soft', 'other'];
  const categoryLabels = {
    frontend: '💻 Frontend',
    backend: '🔧 Backend',
    devops: '⚙️ DevOps',
    design: '🎨 Design',
    soft: '💬 Soft Skills',
    other: '📌 Otros',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingSkill) {
      updateSkill(editingSkill.id, {
        ...formData,
        lastUpdated: new Date(),
      });
    } else {
      addSkill({
        name: formData.name,
        proficiency: formData.proficiency,
        category: formData.category,
        targetProficiency: formData.targetProficiency,
        notes: formData.notes,
      });
    }

    onClose?.();
  };

  return (
    <div className="bg-card border border-border/50 rounded-lg p-6 max-w-lg mx-auto w-full shadow-sm">
      <h2 className="text-lg font-medium mb-6 text-foreground">
        {editingSkill ? 'Editar Skill' : 'Añadir Nueva Skill'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ej: React, Node.js, Docker..."
            className="w-full px-3 py-2 rounded-md border border-border/50 text-sm bg-transparent text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })}
            className="w-full px-3 py-2 rounded-md border border-border/50 text-sm bg-transparent text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-card">
                {categoryLabels[cat as keyof typeof categoryLabels]}
              </option>
            ))}
          </select>
        </div>

        {/* Proficiency actual */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-foreground">
              Proficiency Actual
            </label>
            <span className="text-sm font-medium text-primary">
              {formData.proficiency}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        {/* Target Proficiency */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-foreground">
              Target (Meta)
            </label>
            <span className="text-sm font-medium text-primary">
              {formData.targetProficiency}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.targetProficiency}
            onChange={(e) => setFormData({ ...formData, targetProficiency: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            Notas (opcional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Ej: Necesito practicar más SSR..."
            className="w-full px-3 py-2 rounded-md border border-border/50 text-sm bg-transparent text-foreground min-h-[80px] resize-y focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90"
          >
            {editingSkill ? 'Actualizar' : 'Añadir Skill'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-md border border-border/50 bg-transparent text-foreground font-medium text-sm transition-colors hover:bg-accent"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
