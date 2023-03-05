import "./PlaceItem.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const navigate = useNavigate();

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        console.log("Deleting...");
        try {
            const responseData = await sendRequest(
                `http://localhost:5000/api/places/${props.id}`,
                "DELETE",
                null,
                { "Content-Type": "application/json" }
            );
            props.onDelete();
            navigate(`/${auth.userId}/places`, { push: true });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                    <Button
                        style={{ "margin-top": "1rem" }}
                        onClick={closeMapHandler}
                    >
                        Close
                    </Button>
                }
                style={{ top: "10vh" }}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>
                            Cancel
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            Delete
                        </Button>
                    </React.Fragment>
                }
            >
                <p style={{ padding: "1rem" }}>
                    Do you want to process and delete this place? Please note
                    that it can't be undone thereafter.
                </p>
            </Modal>
            <li className="place-item">
                <Card
                    className="place-item__content"
                    style={{ background: "white" }}
                >
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            View On Map
                        </Button>
                        {auth.isLoggedIn && auth.userId === props.creatorId && (
                            <>
                                <Button to={`/places/${props.id}`}>Edit</Button>
                                <Button
                                    danger
                                    onClick={showDeleteWarningHandler}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;
