import { create } from 'zustand';
import { db } from '../lib/db';
import { fetchUsers as fetchApiUsers } from '@/lib/api';
import { User } from '@/types/user';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    page: number;
    isOnline: boolean;
    totalCachedUsers: number;
    fetchUsers: (page?: number) => Promise<void>;
    toggleFavorite: (userId: string) => Promise<void>;
    setPage: (page: number) => void;
    setIsOnline: (status: boolean) => void;
}

const RESULTS_PER_PAGE = 12;

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    error: null,
    page: 1,
    isOnline: true,
    totalCachedUsers: 0,

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            // Try to fetch from API first
            const apiUsers = await fetchApiUsers(page, RESULTS_PER_PAGE);
            await db.users.bulkPut(apiUsers);
            // Update total count when fetching from API
            const count = await db.users.count();
            set({
                users: apiUsers,
                page,
                isOnline: true,
                totalCachedUsers: count
            });
        } catch (error) {
            console.log('Falling back to cached data');
            // Fallback to IndexedDB with pagination
            const offset = (page - 1) * RESULTS_PER_PAGE;
            const cachedUsers = await db.users
                .offset(offset)
                .limit(RESULTS_PER_PAGE)
                .toArray();

            const totalCount = await db.users.count();

            set({
                users: cachedUsers,
                error: 'Showing cached data!',
                isOnline: false,
                page,
                totalCachedUsers: totalCount
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