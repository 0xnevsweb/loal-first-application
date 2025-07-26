'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { UserCard } from '../components/UserCard';
import { Pagination } from '../components/Pagination';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { LoadingIndicator } from '../components/LoadingIndicator';

export default function Home() {
  const { users, loading, fetchUsers, isOnline, setIsOnline } = useUserStore();

  useEffect(() => {
    fetchUsers();

    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchUsers, setIsOnline]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        User Directory
      </h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 h-fit ${isOnline ? 'text-green-500' : 'text-red-500'}`}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
        <OfflineIndicator />
      </div>

      <div className='relative'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {loading && <LoadingIndicator />}
      </div>

      {users.length ? <Pagination />: <></>}
    </div>
  );
}