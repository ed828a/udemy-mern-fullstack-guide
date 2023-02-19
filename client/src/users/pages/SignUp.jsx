import "../../places/pages/PlaceForm.css";
import React from "react";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";

const initialInputs = {
    email: {
        value: "",
        isValid: false,
    },
    password: {
        value: "",
        isValid: false,
    },
    confirmPassword: {
        value: "",
        isValid: false,
    },
};

const SignUp = () => {
    const [formState, inputHandler] = useForm(initialInputs, false);
    const { password, confirmPassword } = formState.inputs;
    const confirmPasswordValidator = () => {
        return password.value === confirmPassword.value;
    };

    const signupHandler = (event) => {
        event.preventDefault();
        console.log("Sign up...");
    };

    return (
        <div>
            <form className="place-form" onSubmit={signupHandler}>
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
                <Input
                    id="confirmPassword"
                    element="input"
                    type="password"
                    label="Confirm Password"
                    validators={[
                        VALIDATOR_MINLENGTH(3),
                        VALIDATOR_MAXLENGTH(20),
                    ]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    Sign Up
                </Button>
            </form>
        </div>
    );
};

export default SignUp;
