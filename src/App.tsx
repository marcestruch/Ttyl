import { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import Onboarding from "./views/Onboarding";
import Dashboard from "./views/Dashboard";
import FocusMode from "./views/FocusMode";
import { Layout } from "./components/Layout";
import Settings from "./views/Settings";

function App() {
  const { init, hasOnboarded } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    init().finally(() => setIsInitializing(false));
  }, [init]);

  if (isInitializing) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  if (focusTaskId) {
    // FocusMode is fullscreen, no Layout
    return <FocusMode 
      taskId={focusTaskId} 
      onStopFocus={() => setFocusTaskId(null)} 
    />;
  }

  return (
    <Layout onSettingsClick={() => setShowSettings(true)}>
      {showSettings ? (
        <Settings onBack={() => setShowSettings(false)} />
      ) : (
        <Dashboard 
          onStartFocus={(taskId) => setFocusTaskId(taskId)} 
        />
      )}
    </Layout>
  );
}

export default App;
