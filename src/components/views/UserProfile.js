import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const FormField = props => {
    return (
        <div className="profile field">
            <label className="profile label">
                {props.label}
            </label>
            <input
                className="profile input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const UserProfile = () => {
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUser] = useState(null);

    const [newUsername, setNewUsername] = useState(null);
    const [newBirthday, setBirthday] = useState(null);
    const [editField, setEditField] = useState([]);

    const handleEditFieldAdd = () => {
        setEditField([{field: ""}])
    }

    const doEdit = async () => {
        console.log("------------line 44 reached----------");
        console.log(localStorage.getItem("id"));
        const requestBody = JSON.stringify({username: newUsername, birthday: newBirthday});
        console.log(requestBody);
        const url = "/users/" + localStorage.getItem("id");
        await api.put(url, requestBody);
        history.push('/game');
    }

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
                    <div className="profile item">username: {user.username}</div>
                    <div className="profile item">status: {user.status}</div>
                    <div className="profile item">creation date: {user.creationDate}</div>
                    <div className="profile item">birthday: {user.birthday}</div>
                </ul>
                <Button
                    disabled={user.id !== parseInt(localStorage.getItem("id"))}
                    width = "100%"
                    onClick = {handleEditFieldAdd}
                    >
                    Edit
                </Button>
                {editField.map(() => (
                    <div>
                        <FormField
                            label="new username"
                            value={newUsername}
                            onChange={un => setNewUsername(un)}
                        />
                        <FormField
                            label="new birthday"
                            value={newBirthday}
                            onChange={b => setBirthday(b)}
                        />
                        <Button
                            width = "100%"
                            onClick={() => doEdit()}
                        >
                            Confirm Edit
                        </Button>
                    </div>
                ))}

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