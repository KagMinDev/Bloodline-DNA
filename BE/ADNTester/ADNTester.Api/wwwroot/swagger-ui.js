(function () {
    const originalFetch = window.fetch;

    function isJwtFormat(token) {
        // Simple check: JWT typically has 3 parts separated by dots
        if (!token) return false;
        const parts = token.split('.');
        return parts.length === 3;
    }

    window.fetch = function (...args) {
        const [resource, config] = args;

        if (config && config.headers && config.headers.Authorization) {
            let auth = config.headers.Authorization.trim();

            if (!auth.startsWith('Bearer ')) {
                auth = `Bearer ${auth}`;
                config.headers.Authorization = auth;
            }

            // Extract token part (after Bearer )
            const token = auth.slice(7).trim();

            if (!isJwtFormat(token)) {
                alert(
                    "Warning: The token you entered does not appear to be a valid JWT.\n" +
                    "A JWT token usually has three parts separated by dots (e.g., xxxxx.yyyyy.zzzzz).\n" +
                    "Please double-check your token."
                );
            }
        }

        return originalFetch.apply(this, args);
    };
})();
