import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WebSocket2 = () => {
    const [stompClient, setStompClient] = useState(null);

    const setConnected = (connected) => {
        document.getElementById("connect").disabled = connected;
        document.getElementById("disconnect").disabled = !connected;
        if (connected) {
            document.getElementById("conversation").style.display = "block";
        } else {
            document.getElementById("conversation").style.display = "none";
        }
        document.getElementById("greetings").innerHTML = "";
    };

    const connect = () => {
        const socket = new SockJS("/gs-guide-websocket");
        const client = Stomp.over(socket);
        client.connect({}, (frame) => {
            setStompClient(client);
            setConnected(true);
            console.log("Connected: " + frame);
            client.subscribe("/topic/greetings", (greeting) => {
                showGreeting(JSON.parse(greeting.body).content);
            });
        });
    };

    const disconnect = () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    };

    const sendName = () => {
        stompClient.send(
            "/app/hello",
            {},
            JSON.stringify({ name: document.getElementById("name").value })
        );
    };

    const showGreeting = (message) => {
        document.getElementById("greetings").innerHTML +=
            "<tr><td>" + message + "</td></tr>";
    };

    useEffect(() => {
        document.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }, []);

    return (
        <div id="main-content" className="container">
            <div className="row">
                <div className="col-md-6">
                    <form className="form-inline">
                        <div className="form-group">
                            <label htmlFor="connect">WebSocket connection:</label>
                            <button
                                id="connect"
                                className="btn btn-default"
                                type="submit"
                                onClick={connect}
                            >
                                Connect
                            </button>
                            <button
                                id="disconnect"
                                className="btn btn-default"
                                type="submit"
                                disabled={!stompClient}
                                onClick={disconnect}
                            >
                                Disconnect
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-6">
                    <form className="form-inline">
                        <div className="form-group">
                            <label htmlFor="name">What is your name?</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Your name here..."
                            />
                        </div>
                        <button
                            id="send"
                            className="btn btn-primary"
                            type="button"
                            onClick={sendName}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
            <div id="conversation" className="row">
                <div className="col-md-12">
                    <h2>Greetings</h2>
                    <table id="greetings" className="table table-striped"></table>
                </div>
            </div>
        </div>
    );
};

export default WebSocket2;