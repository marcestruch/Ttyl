import { useState, FormEvent } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Onboarding() {
  const setOnboarded = useAppStore(state => state.setOnboarded);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [time, setTime] = useState<number>(25);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setOnboarded({
      name: name.trim(),
      mainGoal: goal.trim() || 'Enfocarme y terminar mis tareas',
      timeBlockDuration: time
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-primary">Bienvenido a Ttyl</h1>
          <p className="text-muted-foreground">Configuremos tu entorno de enfoque.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 shadow-sm border border-border p-6 rounded-2xl bg-card">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">¿Cómo deberíamos llamarte?</label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre o Alias"
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg transition-colors"
                autoFocus
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium">¿Cuál es tu objetivo principal ahora mismo?</label>
              <Input
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="ej. Lanzar mi nuevo proyecto"
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">Duración de Pomodoro (minutos)</label>
              <Input
                id="time"
                type="number"
                min={1}
                max={120}
                value={time}
                onChange={e => setTime(Number(e.target.value))}
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg transition-colors"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            Empezar a enfocarme
          </Button>
        </form>
      </div>
    </div>
  );
}
