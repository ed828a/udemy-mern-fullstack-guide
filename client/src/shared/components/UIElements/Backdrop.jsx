import "./Backdrop.css";
import React from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
    return ReactDOM.createPortal(
        <div className="backdrop" onClick={props.onClick}>
            Backdrop
        </div>,
        document.getElementById("backdrop-hook")
    );
};

export default Backdrop;
