export const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center py-8 absolute h-full w-full top-0 left-0 dark:bg-gray-800/20 bg-gray-400/10">
            <p className="text-lg">Fetching data...</p>
        </div>
    );
};