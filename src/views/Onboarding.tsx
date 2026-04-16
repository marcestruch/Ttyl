import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Onboarding() {
  const setOnboarded = useAppStore(state => state.setOnboarded);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [time, setTime] = useState<number>(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setOnboarded({
      name: name.trim(),
      mainGoal: goal.trim() || 'Focus and get things done',
      timeBlockDuration: time
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-serif text-primary">Welcome to Ttyl</h1>
          <p className="text-muted-foreground">Let's set up your focus environment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 shadow-sm border border-border p-6 rounded-2xl bg-card">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">What should we call you?</label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name or Alias"
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg"
                autoFocus
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium">What is your primary goal right now?</label>
              <Input
                id="goal"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="e.g. Ship my new side project"
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">Preferred time block (minutes)</label>
              <Input
                id="time"
                type="number"
                min={1}
                max={120}
                value={time}
                onChange={e => setTime(Number(e.target.value))}
                className="bg-transparent border-t-0 border-l-0 border-r-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 pb-2 text-lg"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 rounded-xl transition-all">
            Start Focusing
          </Button>
        </form>
      </div>
    </div>
  );
}
