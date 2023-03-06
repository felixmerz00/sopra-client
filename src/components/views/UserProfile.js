import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";
import {Button} from "../ui/Button";


const UserProfile = () => {

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUser] = useState(null);

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {

                const url = "/users/" + window.location.href.slice(-1);
                const response = await api.get(url);

                console.log(response);

                // Get the returned user and update the state.
                setUser(response.data);

                console.log(user);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);


                // See here to get more data.
                console.log(response);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = <div></div>;
    if(user) {
        content = (
            <div className="profile">
                <ul className="profile item-list">
                    <div className="profile item">{user.username}</div>
                    <div className="profile item">{user.status}</div>
                    <div className="profile item">{user.creationDate}</div>
                    <div className="profile item">{user.birthday}</div>
                </ul>
                <Button
                    width="100%"
                >
                    Confirm Edits
                </Button>
            </div>
        );
    }

    return (
        <BaseContainer className="profile container">
            <div className="profile form">
                <h2 className="login header">
                    User Profile
                </h2>
                {content}
            </div>
        </BaseContainer>
    );
}

export default UserProfile;