import "./Auth.css";
import React, { useContext, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const initialInputs = {
    email: {
        value: "",
        isValid: false,
    },
    password: {
        value: "",
        isValid: false,
    },
};

const Auth = () => {
    const [formState, inputHandler, setFormData] = useForm(
        initialInputs,
        false
    );
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const auth = useContext(AuthContext);

    console.log("error", error);

    const authSubmitHandler = async (event) => {
        event.preventDefault();
        console.log("Auth...");
        console.log(formState.inputs);
        try {
            let responseData;
            if (isLoginMode) {
                responseData = await sendRequest(
                    "http://localhost:5000/api/users/login",
                    "POST", // method
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }), //body
                    {
                        "Content-Type": "application/json",
                    } // headers
                );
            } else {
                // FormData is a built-in browser API. in FormData, you can add both text data and file/binary data
                const formData = new FormData();
                formData.append("email", formState.inputs.email.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("name", formState.inputs.name.value);
                formData.append("image", formState.inputs.image.value);

                responseData = await sendRequest(
                    "http://localhost:5000/api/users/signup",
                    "POST",
                    formData // fetch will automatically set proper headers for formdata
                );
            }

            console.log(responseData);

            auth.login(responseData?.user?.id, responseData.token);
        } catch (error) {
            console.log(error);
        }
    };

    const switchModeHandler = (event) => {
        event.preventDefault();

        if (!isLoginMode) {
            // sign up
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            // log in
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }

        setIsLoginMode((prev) => !prev);
        // navigate("/signup");
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication" style={{ background: "white" }}>
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>{isLoginMode ? "Login" : "Sign up"} Required</h2>
                <hr />
                <form className="" onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Your Name"
                            validators={[
                                VALIDATOR_REQUIRE(),
                                VALIDATOR_MINLENGTH(3),
                            ]}
                            errorText="Please enter a valid name (at least 3 charaters long)."
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload
                            id="image"
                            center
                            onInput={inputHandler}
                            errorText="Please provide an image"
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email."
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[
                            VALIDATOR_MINLENGTH(5),
                            VALIDATOR_MAXLENGTH(20),
                        ]}
                        errorText="Please enter a valid password (between 5 to 20 characters)."
                        onInput={inputHandler}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "Log In" : "Sign Up"}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    Switch to {isLoginMode ? "Sign Up" : "Log In"}
                </Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;
