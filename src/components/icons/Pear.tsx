import React from 'react';

export const Pear = (props: React.ComponentProps<'svg'>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 22c4.4 0 8-3 8-7 0-3-2-5-4-6 0-3 1-5 1-5s-2.5 1-5 4c-2.5-3-5-4-5-4s1 2 1 5c-2 1-4 3-4 6 0 4 3.6 7 8 7Z" />
            <path d="M12 4V2" />
            <path d="M15 2c-1 0-2 2-2 2" />
        </svg>
    );
};
