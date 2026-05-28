import React, {useEffect, useState} from 'react';

function InstallPrompt() {
  // State to store the install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // State to decide whether to show the install button
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    // This event fires when the browser determines the PWA can be installed
    const handler = (e) => {
      // Prevent the browser's default install prompt
      e.preventDefault();

      // Save the event object for later use
      setDeferredPrompt(e);

      // Show our custom install button
      setShowInstall(true);

      console.log('PWA installation available!');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Install button click handler
  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Trigger the saved install prompt
    deferredPrompt.prompt();

    // Wait for the user's choice
    const {outcome} = await deferredPrompt.userChoice;

    console.log(`User choice: ${outcome}`);
    // outcome is either 'accepted' or 'dismissed'

    if (outcome === 'accepted') {
      console.log('PWA installation completed!');
    } else {
      console.log('PWA installation cancelled');
    }

    // The prompt can only be used once, so reset it
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  // Don't render anything if we shouldn't show the install button
  if (!showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-1000">
      <button
        onClick={handleInstall}
        className="bg-[#4CAF50] text-white px-7 py-3.5 border-none rounded-[25px] text-base cursor-pointer shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex items-center gap-2.5 hover:opacity-90"
      >
        📱 Install App
      </button>
    </div>
  );
}

export default InstallPrompt;
