import { useUserStore } from '../store/userStore';

export const OfflineIndicator = () => {
    const { isOnline, error } = useUserStore();

    if (isOnline) return null;

    return (
        <div className="text-yellow-700 px-4 py-2 mb-4 dark:text-yellow-200">
            <p>{error || 'You are offline!'}</p>
        </div>
    );
};