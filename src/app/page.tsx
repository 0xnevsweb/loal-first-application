'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { UserCard } from '../components/UserCard';
import { Pagination } from '../components/Pagination';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { User } from '@/types/user';

export default function Home() {
  const { users, loading, fetchUsers, isOnline, setIsOnline } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchUsers();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchUsers, setIsOnline]);

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.first.toLowerCase().includes(query) ||
      user.name.last.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }).sort((a, b) => {
    if (!sortField) return 0;

    // Handle nested fields
    const getValue = (user: User, field: string) => {
      return field.split('.').reduce((obj, key) => obj[key as keyof typeof obj], user as any);
    };

    const aValue = getValue(a, sortField as string);
    const bValue = getValue(b, sortField as string);

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

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

      {/* Search and Sort Controls */}
      <div className="mb-4 flex gap-2">
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortField || ''}
            onChange={(e) => setSortField(e.target.value as keyof User || null)}
            className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Default Order</option>
            <option value="name.first">First Name</option>
            <option value="name.last">Last Name</option>
            <option value="email">Email</option>
          </select>

          {sortField && (
            <button
              onClick={toggleSortDirection}
              className="p-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          )}
        </div>
      </div>

      <div className='relative'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {loading && <LoadingIndicator />}
      </div>

      {filteredUsers.length ? <Pagination /> : null}
    </div>
  );
}