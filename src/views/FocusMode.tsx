import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { X, Check, RotateCcw, Coffee, Zap } from 'lucide-react';
import { FocusSession } from '../lib/storage';

type Phase = 'work' | 'break';

export default function FocusMode({ taskId, onStopFocus }: { taskId: string, onStopFocus: () => void }) {
  const { tasks, user, toggleTask, updateTask, addFocusSession } = useAppStore();
  const task = tasks.find(t => t.id === taskId);
  
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(user.timeBlockDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio chime
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const playChime = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const saveSession = useCallback(() => {
    if (!task || phase !== 'work') return;
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
  }, [task, startTime, addFocusSession, phase]);

  const handlePhaseComplete = useCallback(() => {
    playChime();
    setIsRunning(false);
    
    if (phase === 'work') {
      if (task) {
        updateTask(task.id, { pomodoros: task.pomodoros + 1 });
        saveSession();
      }
      // Switch to break
      setPhase('break');
      setTimeLeft(5 * 60); // 5 minute break by default
    } else {
      // Switch back to work
      setPhase('work');
      setTimeLeft(user.timeBlockDuration * 60);
      setStartTime(Date.now());
    }
  }, [task, phase, updateTask, saveSession, user.timeBlockDuration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handlePhaseComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handlePhaseComplete]);

  const handleReset = () => {
    setIsRunning(false);
    if (phase === 'work') {
      setTimeLeft(user.timeBlockDuration * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  };

  const handleToggle = () => {
    if (!isRunning && timeLeft === (phase === 'work' ? user.timeBlockDuration * 60 : 5 * 60)) {
       setStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isUrgent = timeLeft > 0 && timeLeft <= 60;

  const handleCompleteTask = () => {
    saveSession();
    if (task && !task.completed) {
      toggleTask(task.id);
    }
    onStopFocus();
  };

  const handleExit = () => {
    saveSession();
    onStopFocus();
  };

  if (!task) return null;

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-8 transition-colors duration-1000 ${
      phase === 'work' ? 'bg-background' : 'bg-primary/5 dark:bg-primary/10'
    } animate-in zoom-in-95 duration-700`}>
      <div className="absolute top-8 right-8">
        <Button variant="ghost" size="icon" onClick={handleExit} className="rounded-full w-12 h-12 hover:bg-muted">
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="space-y-16 text-center max-w-2xl w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary w-fit mx-auto mb-6">
            {phase === 'work' ? (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold uppercase tracking-wider">Modo Enfoque</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Descanso</span>
              </>
            )}
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight">
            {phase === 'work' ? task.title : 'Tómate un descanso'}
          </h2>
        </div>

        <div 
          className={`font-sans font-semibold font-variant-numeric: tabular-nums text-[8rem] md:text-[12rem] xl:text-[16rem] leading-none tracking-tighter cursor-pointer select-none transition-all hover:scale-105 active:scale-95 ${
            !isRunning ? 'opacity-40 text-foreground' : (phase === 'work' ? 'text-primary' : 'text-green-500')
          } ${isUrgent && phase === 'work' ? 'animate-pulse text-destructive' : ''}`}
          onClick={handleToggle}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-6">
          <Button 
            size="lg" 
            variant="outline"
            className="rounded-full h-14 px-8 text-lg border-border hover:bg-accent transition-all w-32"
            onClick={handleToggle}
          >
            {isRunning ? 'Pausa' : (phase === 'work' && timeLeft === user.timeBlockDuration * 60 ? 'Empezar' : 'Continuar')}
          </Button>

          {phase === 'work' && (
            <Button 
              size="lg" 
              className="rounded-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-all w-48 shadow-lg shadow-primary/20"
              onClick={handleCompleteTask}
            >
              <Check className="w-5 h-5" />
              Completar Tarea
            </Button>
          )}

          <Button
            size="lg"
            variant="ghost"
            className="rounded-full h-14 w-14 text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            onClick={handleReset}
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

