import React from 'react';

function Offline() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-5">
      <h1 className="text-4xl font-bold mb-4">🔌 Offline Mode</h1>
      <p>Please check your internet connection.</p>
      <p>Some features are still available offline.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-5 px-5 py-2.5 text-base cursor-pointer bg-accent text-white rounded-md hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}

export default Offline;
