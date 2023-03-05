import "./PlaceForm.css";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const initialInputs = {
    title: {
        value: "",
        isValid: false,
    },
    description: {
        value: "",
        isValid: false,
    },
    address: {
        value: "",
        isValid: false,
    },
};

const NewPlace = () => {
    const [formState, inputHandler] = useForm(initialInputs, false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // console.log("NewPlace formState", formState);

    const submitHandler = async (event) => {
        event.preventDefault();
        // send form data to server
        try {
            const responseData = await sendRequest(
                "http://localhost:5000/api/places",
                "POST",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: auth.userId,
                }),
                { "Content-Type": "application/json" }
            );
            console.log(responseData);
            // redirect the user to a different page.
            // navigate("/another-page", { replace: true });
            navigate("/", { push: true });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />

            <form className="place-form" onSubmit={submitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />

                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid desription (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    Add Place
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
