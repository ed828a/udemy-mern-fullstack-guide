import "./NavLinks.css";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";

const NavLinks = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact="true">
                    All Users
                </NavLink>
            </li>
            {auth.isLoggedIn && (
                <li>
                    <NavLink to="/u1/places">My Places</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>
            )}

            {!auth.isLoggedIn && (
                <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <button type="button" onClick={auth.logout}>
                        Log Out
                    </button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;
