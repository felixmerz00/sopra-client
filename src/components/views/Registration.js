import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="registration field">
            <label className="registration label">
                {props.label}
            </label>
            <input
                className="registration input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const PasswordField = props => {
    return (
        <div className="registration field">
            <label className="registration label">
                {props.label}
            </label>
            <input type={"password"}
                className="registration input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

PasswordField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Registration = props => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({username, password: password});
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('id', user.id);

            // Registration successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the registration: \n${handleError(error)}`);
            window.location.reload();
        }
    };


    return (
        <BaseContainer>
            <div className="registration container">
                <div className="registration form">
                    <h2 className="registration header">
                        Registration
                    </h2>
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <div className="registration button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegistration()}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};


/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;
