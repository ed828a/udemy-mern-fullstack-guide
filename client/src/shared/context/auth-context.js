import React, { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

const AuthContextState = () => {
    return <div>AuthContextState</div>;
};

export default AuthContextState;
