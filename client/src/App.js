import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
// import NewPlace from "./places/pages/NewPlace";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import Auth from "./users/pages/Auth";
import MainNavigtor from "./shared/components/Navigation/MainNavigtion";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Users from "./users/pages/Users";
// import LogIn from "./users/pages/LogIn";
// import SignUp from "./users/pages/SignUp";
// import Page404 from './shared/pages/404';

const UserPlaces = lazy(() => import("./places/pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

const SuspensedElement = ({ children }) => (
    <Suspense
        fallback={
            <div className="center">
                <LoadingSpinner />
            </div>
        }
    >
        {children}
    </Suspense>
);

function App() {
    const { token, userId, login, logout } = useAuth();
    let routes;
    if (token) {
        routes = (
            <Routes>
                <Route path="/" element={<Users />} />
                <Route
                    path="/:userId/places"
                    element={
                        <Suspense
                            fallback={
                                <div className="center">
                                    <LoadingSpinner />
                                </div>
                            }
                        >
                            <UserPlaces />
                        </Suspense>
                    }
                />
                <Route
                    path="/places/new"
                    element={
                        <SuspensedElement>
                            <NewPlace />
                        </SuspensedElement>
                    }
                />
                <Route
                    path="/places/:placeId"
                    element={
                        <SuspensedElement>
                            <UpdatePlace />
                        </SuspensedElement>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/" element={<Users />} />
                <Route
                    path="/:userId/places"
                    element={
                        <SuspensedElement>
                            <UserPlaces />
                        </SuspensedElement>
                    }
                />
                <Route
                    path="/auth"
                    element={
                        <SuspensedElement>
                            <Auth />
                        </SuspensedElement>
                    }
                />
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        );
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn: !!token, token, userId, login, logout }}
        >
            <BrowserRouter>
                <main className="App">
                    <MainNavigtor />
                    {routes}
                </main>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
