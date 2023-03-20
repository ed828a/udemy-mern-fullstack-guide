import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigtor from "./shared/components/Navigation/MainNavigtion";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Auth from "./users/pages/Auth";
// import LogIn from "./users/pages/LogIn";
// import SignUp from "./users/pages/SignUp";
// import Page404 from './shared/pages/404';
import Users from "./users/pages/Users";

function App() {
    const { token, userId, login, logout } = useAuth();
    let routes;
    if (token) {
        routes = (
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="/:userId/places" element={<UserPlaces />} />
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="/:userId/places" element={<UserPlaces />} />
                <Route path="auth" element={<Auth />} />
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
