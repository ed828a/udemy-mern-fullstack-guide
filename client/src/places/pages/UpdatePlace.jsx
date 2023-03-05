import "./PlaceForm.css";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
    const { placeId } = useParams();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const [placeNotFound, setPlaceNotFound] = useState(false);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: null,
                isValid: false,
            },
            description: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const fetchPlaceById = async (pid) => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/${pid}`,
                    "GET",
                    null,
                    { "Content-type": "application/json" }
                );

                setLoadedPlace(responseData.place);

                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (error) {
                console.log(error);
                if (error.code === 404) {
                    setPlaceNotFound(true);
                }
            }
        };

        fetchPlaceById(placeId);
        console.log("called fetchPlaceById");
    }, [sendRequest, setFormData, placeId]);

    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        try {
            const responseData = await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                { "Content-Type": "application/json" }
            );
            console.log(responseData);
            navigate(`/${auth.userId}/places`, { push: true });
        } catch (error) {
            console.log(error);
        }
    };

    if (placeNotFound) {
        return (
            <Card style={{ background: "white", padding: "1rem" }}>
                <h2>Could not found that place</h2>
            </Card>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    {isLoading && <LoadingSpinner asOverlay />}
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title"
                        onInput={inputHandler}
                        initialValue={formState.inputs.title.value}
                        initialValid={formState.inputs.title.isValid}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description"
                        onInput={inputHandler}
                        initialValue={formState.inputs.description.value}
                        initialValid={formState.inputs.description.isValid}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Update Place
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
};

export default UpdatePlace;
