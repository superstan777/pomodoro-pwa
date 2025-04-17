import { useState, useEffect } from "react";
import Timer from "./components/Timer";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const promptToInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        console.log(choiceResult.outcome);
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {isInstallable && (
        <button
          onClick={promptToInstall}
          className="my-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
        >
          Install App
        </button>
      )}
      <Timer />
    </div>
  );
}

export default App;
