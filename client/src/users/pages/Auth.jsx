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

    const auth = useContext(AuthContext);

    const authSubmitHandler = (event) => {
        event.preventDefault();
        console.log("Sign up...");
        auth.login();
    };

    const switchModeHandler = (event) => {
        event.preventDefault();

        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
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
        <Card className="authentication" style={{ background: "white" }}>
            <h2>Login Required</h2>
            <hr />
            <form className="" onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid name."
                        onInput={inputHandler}
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
                        VALIDATOR_MINLENGTH(3),
                        VALIDATOR_MAXLENGTH(20),
                    ]}
                    errorText="Please enter a valid password (between 3 to 20 characters)."
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
    );
};

export default Auth;
