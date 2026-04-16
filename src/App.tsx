import React, { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import Onboarding from "./views/Onboarding";
import Dashboard from "./views/Dashboard";
import FocusMode from "./views/FocusMode";
import { CommandPalette } from "./components/CommandPalette";

function App() {
  const { init, hasOnboarded } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  useEffect(() => {
    init().finally(() => setIsInitializing(false));
  }, [init]);

  if (isInitializing) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      {hasOnboarded && <CommandPalette />}
      
      {!hasOnboarded ? (
        <Onboarding />
      ) : focusTaskId ? (
        <FocusMode 
          taskId={focusTaskId} 
          onStopFocus={() => setFocusTaskId(null)} 
        />
      ) : (
        <Dashboard 
          onStartFocus={(taskId) => setFocusTaskId(taskId)} 
        />
      )}
    </>
  );
}

export default App;
