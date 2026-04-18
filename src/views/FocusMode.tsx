import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '../components/ui/button';
import { X, Check } from 'lucide-react';
import { FocusSession } from '../lib/storage';

export default function FocusMode({ taskId, onStopFocus }: { taskId: string, onStopFocus: () => void }) {
  const { tasks, user, toggleTask, updateTask, addFocusSession } = useAppStore();
  const task = tasks.find(t => t.id === taskId);
  
  const [timeLeft, setTimeLeft] = useState(user.timeBlockDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    invoke('run_system_script', { scriptName: 'on_start.sh' })
      .then(res => console.log('Hook executed:', res))
      .catch(err => console.error('Hook err:', err));

    setIsRunning(true);

    return () => {
      invoke('run_system_script', { scriptName: 'on_stop.sh' })
        .then(res => console.log('Hook executed:', res))
        .catch(err => console.error('Hook err:', err));
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleCompletePomodoro();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, task]);

  const handleCompletePomodoro = () => {
    if (task) {
       updateTask(task.id, { pomodoros: task.pomodoros + 1 });
       saveSession();
    }
  };

  const saveSession = () => {
    if (!task) return;
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);
    if (durationMinutes > 0) {
      const session: FocusSession = {
        id: crypto.randomUUID(),
        taskId: task.id,
        startedAt: startTime,
        endedAt: Date.now(),
        durationMinutes
      };
      addFocusSession(session);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isUrgent = timeLeft > 0 && timeLeft <= 60;

  const handleComplete = () => {
    saveSession();
    if (task && !task.completed) {
      toggleTask(task.id);
    }
    onStopFocus();
  };

  const handleStop = () => {
    saveSession();
    onStopFocus();
  };

  if (!task) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground animate-in zoom-in-95 duration-700">
      <div className="absolute top-8 right-8">
        <Button variant="ghost" size="icon" onClick={handleStop} className="rounded-full w-12 h-12 hover:bg-muted">
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="space-y-16 text-center max-w-2xl w-full">
        <div className="space-y-4">
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Focusing On</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight">{task.title}</h2>
        </div>

        <div 
          className={`font-sans font-semibold font-variant-numeric: tabular-nums text-[8rem] md:text-[12rem] xl:text-[16rem] leading-none tracking-tighter cursor-pointer select-none transition-all hover:scale-105 active:scale-95 ${!isRunning ? 'opacity-50 text-foreground' : 'text-primary'} ${isUrgent ? 'animate-pulse text-destructive' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-6">
          <Button 
            size="lg" 
            variant="outline"
            className="rounded-full h-14 px-8 text-lg border-border hover:bg-accent hover:border-transparent transition-all w-32"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Resume'}
          </Button>

          <Button 
            size="lg" 
            className="rounded-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-all w-48 shadow-lg shadow-primary/20"
            onClick={handleComplete}
          >
            <Check className="w-5 h-5" />
            Complete Task
          </Button>
        </div>
      </div>
    </div>
  );
}
