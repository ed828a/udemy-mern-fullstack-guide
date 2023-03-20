import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        const tokenExpirationDate =
            expirationDate ||
            new Date(new Date().getTime() + 1000 * 60 * 60 * 1);
        // new Date(new Date().getTime() + 1000 * 60 * 60 * 10); // 10 hours
        setTokenExpirationDate(tokenExpirationDate);
        setToken(token);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString(),
            })
        );
        setUserId(uid);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem("userData");
        setTokenExpirationDate(null);
        setUserId(null);
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [logout, token, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            // this is login
            login(
                storedData.token,
                storedData.userId,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return { token, userId, login, logout };
};

// export default useAuth;
