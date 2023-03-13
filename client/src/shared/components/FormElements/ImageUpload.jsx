import "./ImageUpload.css";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

const ImageUpload = (props) => {
    const filePickerRef = useRef();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader(); // FileReader is baked into the browser.
        // onLoad is called when the fileReader finishes parsing a file OR load a new file
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result); // result is an Url from fileReader finished readAsDataURL
        };
        fileReader.readAsDataURL(file); // this create a URL, and store it in result property
    }, [file]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };
    const pickedHandler = (event) => {
        // console.log(event.target);
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            setFile(event.target.files[0]);
            setIsValid(true);
            pickedFile = event.target.files[0];
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    return (
        <div className="form-control">
            <input
                type="file"
                ref={filePickerRef}
                name=""
                id={props.id}
                style={{ display: "none" }}
                accept=".jpg, .jpeg, .png"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                <div className="image-upload__preview">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" />
                    ) : (
                        <p>Please pick an image</p>
                    )}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    Pick Image
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
