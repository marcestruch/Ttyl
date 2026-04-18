import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Settings({ onBack }: { onBack: () => void }) {
  const { user, updateUser, theme, setTheme } = useAppStore();
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.mainGoal);
  const [time, setTime] = useState(user.timeBlockDuration);

  const handleSave = () => {
    updateUser({ name, mainGoal: goal, timeBlockDuration: time });
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <header className="px-8 pt-12 pb-6 shrink-0 border-b border-border/50">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h2>
            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Main Goal</label>
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
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preferences</h2>
            <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
              <div>
                <label className="text-sm font-medium">Pomodoro Duration (minutes)</label>
                <input 
                  type="number" 
                  value={time} 
                  onChange={e => setTime(Number(e.target.value))}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Theme</label>
                <select 
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary appearance-none transition-colors"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <button onClick={onBack} className="px-6 py-2 rounded-md font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
          </div>

        </div>
      </main>
    </div>
  );
}
