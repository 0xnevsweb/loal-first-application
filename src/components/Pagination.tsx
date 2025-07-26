import { useUserStore } from '../store/userStore';

export const Pagination = () => {
    const {
        page,
        setPage,
        fetchUsers,
        isOnline,
        totalCachedUsers
    } = useUserStore();

    const RESULTS_PER_PAGE = 10;

    const handlePrevious = () => {
        const newPage = Math.max(1, page - 1);
        setPage(newPage);
        fetchUsers(newPage);
    };

    const handleNext = () => {
        // Only allow next page if we're online or there are more cached users
        if (isOnline || (page * RESULTS_PER_PAGE) < totalCachedUsers) {
            const newPage = page + 1;
            setPage(newPage);
            fetchUsers(newPage);
        }
    };

    return (
        <div className="flex justify-center space-x-4 mt-6">
            <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:bg-blue-600 dark:disabled:bg-gray-600"
            >
                Previous
            </button>
            <span className="px-4 py-2 dark:text-white">
                Page {page} {!isOnline && `(Cached)`}
            </span>
            <button
                onClick={handleNext}
                disabled={!isOnline && (page * RESULTS_PER_PAGE) >= totalCachedUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:bg-blue-600 dark:disabled:bg-gray-600"
            >
                Next
            </button>
        </div>
    );
};