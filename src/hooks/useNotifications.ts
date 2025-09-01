'use client';

interface NotificationPermissionStatus {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export function useNotifications(): NotificationPermissionStatus {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';
    
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    
    const permission = await Notification.requestPermission();
    return permission;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || Notification.permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted');
      return;
    }

    const notification = new Notification(title, {
      icon: '/icons/friendyouthlogo.png',
      badge: '/icons/friendyouthlogo.png',
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  return {
    permission: isSupported ? Notification.permission : 'denied',
    requestPermission,
    sendNotification,
    isSupported,
  };
}

// Service Worker Registration for Push Notifications
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // Replace with your VAPID public key
        'YOUR_VAPID_PUBLIC_KEY_HERE'
      ) as BufferSource,
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
