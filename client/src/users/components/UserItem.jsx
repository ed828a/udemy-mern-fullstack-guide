import "./UserItem.css";
import React from "react";
import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";

const UserItem = ({ id, image, name, placeCount }) => {
    console.log("image", image);
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <Link to={!!placeCount ? `/${id}/places` : "/404"}>
                    <div className="user-item__image">
                        <Avatar
                            image={`${process.env.REACT_APP_ASSETS_URL}/${image}`}
                            alt={name}
                        />
                    </div>
                    <div className="user-item__info">
                        <h2>{name}</h2>
                        <h3>
                            {placeCount} {placeCount === 1 ? "Place" : "Places"}
                        </h3>
                    </div>
                </Link>
            </Card>
        </li>
    );
};

export default UserItem;
