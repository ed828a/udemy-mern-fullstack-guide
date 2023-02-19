import React from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    const navigate = useNavigate();

    const handleRedirect = (event) => {
        event.preventDefault();

        navigate("/");
    };

    return (
        <div>
            <h1>404 Page not found</h1>
            <button onClick={handleRedirect}>Redirect</button>{" "}
        </div>
    );
};

export default Page404;
