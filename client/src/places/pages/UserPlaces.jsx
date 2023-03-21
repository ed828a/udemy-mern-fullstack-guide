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
                    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
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

    const regex = /Could not find a place for the provided user id/gm;
    console.log(!regex.test(error));
    return (
        <React.Fragment>
            {regex.test(error) ? (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={deletePlaceHandler}
                />
            ) : (
                <ErrorModal error={error} onClear={clearError} />
            )}
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
