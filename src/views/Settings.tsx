import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';

export default function Settings({ onBack }: { onBack: () => void }) {
  const { user, updateUser, theme, setTheme } = useAppStore();
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.mainGoal);
  const [time, setTime] = useState(user.timeBlockDuration);

  // Sync state with user data if it changes while open (though unlikely)
  useEffect(() => {
    setName(user.name);
    setGoal(user.mainGoal);
    setTime(user.timeBlockDuration);
  }, [user]);

  const handleSave = () => {
    updateUser({ name, mainGoal: goal, timeBlockDuration: time });
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <header className="px-8 pt-12 pb-6 shrink-0 border-b border-border/50">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Ajustes</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Perfil</h2>
            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Objetivo principal</label>
                <input 
                  type="text" 
                  value={goal} 
                  onChange={e => setGoal(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preferencias</h2>
            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div>
                <label className="text-sm font-medium">Duración de Pomodoro (minutos)</label>
                <input 
                  type="number" 
                  value={time} 
                  onChange={e => setTime(Number(e.target.value))}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tema</label>
                <select 
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary appearance-none transition-colors"
                >
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <Button onClick={onBack} variant="ghost" className="px-6 py-2 rounded-md font-medium">Cancelar</Button>
            <Button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">Guardar cambios</Button>
          </div>

        </div>
      </main>
    </div>
  );
}
