import {useEffect, useState} from 'react';

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    function handleOnline(): void {
      setIsOnline(true);
      console.log('Internet connection restored!');
    }

    function handleOffline(): void {
      setIsOnline(false);
      console.log('Internet connection lost.');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default useOnlineStatus;
