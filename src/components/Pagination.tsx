import { useUserStore } from '../store/userStore';

export const Pagination = () => {
    const { page, setPage, fetchUsers } = useUserStore();

    const handlePrevious = () => {
        const newPage = Math.max(1, page - 1);
        setPage(newPage);
        fetchUsers(newPage);
    };

    const handleNext = () => {
        const newPage = page + 1;
        setPage(newPage);
        fetchUsers(newPage);
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
            <span className="px-4 py-2 dark:text-white">Page {page}</span>
            <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-600"
            >
                Next
            </button>
        </div>
    );
};