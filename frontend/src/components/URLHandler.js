import { useEffect } from 'react';

function URLHandler() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        if (username) {
            localStorage.setItem('username', username);
        }
    }, []);

    return null;
}

export default URLHandler; 