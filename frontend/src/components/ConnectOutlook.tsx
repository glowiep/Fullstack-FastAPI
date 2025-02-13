const ConnectOutlook = () => {
    return (
        <>
            <button
            className="w-fit button-secondary cursor-pointer text-black flex gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
            >
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6">
                <path
                d="M24 2C12.955 2 4 10.955 4 22s8.955 20 20 20 20-8.955 20-20S35.045 2 24 2zm0 36c-8.837 0-16-7.163-16-16S15.163 6 24 6s16 7.163 16 16-7.163 16-16 16z"
                fill="#0078D4"
                ></path>
                <path
                d="M24 10c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                fill="#0078D4"
                ></path>
                <path
                d="M24 14c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
                fill="#0078D4"
                ></path>
            </svg>
                Import Outlook Calendar
            </button>
        </>
    )
};

export default ConnectOutlook;