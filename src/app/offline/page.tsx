'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTryAgain = () => {
    if (isClient) {
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v4m0 12v4m10-10h-4M6 12H2"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            You&apos;re offline
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Check your internet connection and try again.
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Some features may not work properly while offline.
              </p>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleTryAgain}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
