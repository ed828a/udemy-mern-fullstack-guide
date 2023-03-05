import "./PlaceList.css";
import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card style={{ background: "white", padding: "1rem" }}>
                    <h2>No Places Found. Maybe Create One?</h2>
                    <Button to="/places/new">Share Place</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="place-list">
            {props.items.map((place) => {
                console.log("place", place);
                return (
                    <PlaceItem
                        key={place.id}
                        id={place.id}
                        image={place.image}
                        title={place.title}
                        description={place.description}
                        address={place.address}
                        creatorId={place.creator}
                        coordinates={place.location}
                        onDelete={() => props.onDeletePlace(place.id)}
                    />
                );
            })}
        </ul>
    );
};

export default PlaceList;
