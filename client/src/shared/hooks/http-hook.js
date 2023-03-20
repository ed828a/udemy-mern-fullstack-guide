import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const activeHttpRequests = useRef([]); // use for cancel on-going requests

    const sendRequest = useCallback(
        async (url, method = "GET", body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal,
                    // link abortController to this http request, so that we can use this httpAbortCtrl to cancel this request.
                });
                console.log(response);
                const responseData = await response.json();
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortCtrl
                );
                console.log(responseData);

                setIsLoading(false);

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                return responseData;
            } catch (error) {
                setError(
                    error.message || "Something went wrong, try again later"
                );
                setIsLoading(false);
                throw error;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        // to cancel the request when switching page before getting response
        return () => {
            activeHttpRequests.current.forEach((abortCtrl) =>
                abortCtrl.abort()
            );
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};
