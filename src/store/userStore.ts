import { create } from 'zustand';
import { db } from '../lib/db';
import { fetchUsers } from '@/lib/api';
import { User } from '@/types/user';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    page: number;
    isOnline: boolean;
    fetchUsers: (page?: number) => Promise<void>;
    toggleFavorite: (userId: string) => Promise<void>;
    setPage: (page: number) => void;
    setIsOnline: (status: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    error: null,
    page: 1,
    isOnline: true,

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            // Try to fetch from API first
            const apiUsers = await fetchUsers(page);
            await db.users.bulkPut(apiUsers);
            set({ users: apiUsers, page, isOnline: true });
        } catch (error) {
            console.log('Falling back to cached data');
            // Fallback to IndexedDB
            const cachedUsers = await db.users.toArray();
            set({
                users: cachedUsers,
                error: 'You are offline. Showing cached data.',
                isOnline: false
            });
        } finally {
            set({ loading: false });
        }
    },

    toggleFavorite: async (userId: string) => {
        const user = await db.users.get(userId);
        if (user) {
            await db.users.update(userId, { isFavorite: !user.isFavorite });
            set((state) => ({
                users: state.users.map((u) =>
                    u.id === userId ? { ...u, isFavorite: !u.isFavorite } : u
                ),
            }));
        }
    },

    setPage: (page: number) => set({ page }),

    setIsOnline: (status: boolean) => set({ isOnline: status }),
}));