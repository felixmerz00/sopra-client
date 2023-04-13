import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WebSocket2 = () => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [greetings, setGreetings] = useState([]);
    const [name, setName] = useState("");

    const connect = () => {
        const socket = new SockJS("/gs-guide-websocket");
        const client = Stomp.over(socket);
        client.connect({}, (frame) => {
            setConnected(true);
            console.log("Connected: " + frame);
            client.subscribe("/topic/greetings", (greeting) => {
                showGreeting(JSON.parse(greeting.body).content);
            });
            setStompClient(client);
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
        stompClient.send("/app/hello", {}, JSON.stringify({ name }));
    };

    const showGreeting = (message) => {
        setGreetings((prevGreetings) => [...prevGreetings, message]);
    };

    useEffect(() => {
        ("form").on("submit", (e) => {
            e.preventDefault();
        });
    }, []);

    return (
        <div>
            <form>
                <button disabled={connected} onClick={connect}>
                    Connect
                </button>
                <button disabled={!connected} onClick={disconnect}>
                    Disconnect
                </button>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={sendName}>Send</button>
            </form>
            <table id="greetings">
                <tbody>
                {greetings.map((greeting, index) => (
                    <tr key={index}>
                        <td>{greeting}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WebSocket2;