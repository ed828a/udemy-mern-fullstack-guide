import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UsersList from "../components/UsersList";

const Users = () => {
    const [users, setUsers] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const sendRequestForUsers = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users"
                );

                console.log(responseData);

                setUsers(responseData.users);
            } catch (error) {
                console.log(error.message);
            }
        };

        sendRequestForUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && users.length > 0 && <UsersList items={users} />}
        </React.Fragment>
    );
};

export default Users;
