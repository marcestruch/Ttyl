// components/SkillsRadar.tsx
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useSkillsStore } from '../store/skillsStore';
import { Skill } from '../types/skills';

export const SkillsRadar: React.FC = () => {
  const { skills } = useSkillsStore();
  const [selectedCategory, setSelectedCategory] = useState<Skill['category'] | 'all'>('all');

  // Preparar datos para el gráfico radar
  const getChartData = () => {
    const filtered = selectedCategory === 'all' 
      ? skills 
      : skills.filter(s => s.category === selectedCategory);
    
    return filtered.map(skill => ({
      name: skill.name,
      proficiency: skill.proficiency,
      target: skill.targetProficiency || 100,
      category: skill.category,
    }));
  };

  const chartData = getChartData();
  const categories: Skill['category'][] = ['frontend', 'backend', 'devops', 'design', 'soft'];
  const categoryLabels = {
    frontend: '💻 Frontend',
    backend: '🔧 Backend',
    devops: '⚙️ DevOps',
    design: '🎨 Design',
    soft: '💬 Soft Skills',
    other: '📌 Otros',
  };

  if (skills.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p className="text-sm mb-4">
          Sin skills aún. Añade tu primera skill para ver el gráfico radar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Selector de categoría */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
            selectedCategory === 'all'
              ? 'border-primary border-2 bg-primary/10 text-primary'
              : 'border-border/50 border bg-transparent text-foreground hover:bg-accent'
          }`}
        >
          Todo
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? 'border-primary border-2 bg-primary/10 text-primary'
                : 'border-border/50 border bg-transparent text-foreground hover:bg-accent'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Gráfico Radar */}
      {chartData.length > 0 ? (
        <div className="w-full h-[400px] flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Radar
                name="Proficiency"
                dataKey="proficiency"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#639922"
                fill="none"
                strokeDasharray="5 5"
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value) => Math.round(value as number) + '%'}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          No hay skills en esta categoría
        </p>
      )}

      {/* Stats */}
      <div className="mt-8 p-4 bg-card border border-border rounded-lg">
        <h3 className="text-base font-medium mb-4 text-foreground">
          Resumen
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Promedio
            </p>
            <p className="text-2xl font-medium m-0 text-foreground">
              {chartData.length > 0 
                ? Math.round(
                    chartData.reduce((acc, skill) => acc + skill.proficiency, 0) / chartData.length
                  )
                : 0
              }%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Skills
            </p>
            <p className="text-2xl font-medium m-0 text-foreground">
              {chartData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Máximo
            </p>
            <p className="text-2xl font-medium m-0 text-foreground">
              {chartData.length > 0
                ? Math.max(...chartData.map(s => s.proficiency))
                : 0
              }%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
