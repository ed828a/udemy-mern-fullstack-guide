import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
    const userId = useParams().userId;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState([]);

    useEffect(() => {
        const fetchPlacesByUserId = async (uid) => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPlacesByUserId(userId);
    }, [sendRequest, userId]);

    const deletePlaceHandler = (pid) =>
        setLoadedPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== pid)
        );

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces.length > 0 && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={deletePlaceHandler}
                />
            )}
            ;
        </React.Fragment>
    );
};

export default UserPlaces;
