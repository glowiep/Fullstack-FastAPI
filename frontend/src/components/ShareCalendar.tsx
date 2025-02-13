const ShareCalendar = () => {
    return (
        <>
            <button className="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" viewBox="0 0 24 24" height="24" fill="none" className="svg-icon">
                    <g stroke-width="2" stroke-linecap="round" stroke="#fff">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <path d="M16 6l-4-4-4 4"></path>
                        <path d="M12 2v11"></path>
                    </g>
                </svg>
                <span className="label">Share</span>
            </button>
        </>
    )
};

export default ShareCalendar;