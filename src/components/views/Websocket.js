import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function ChatWebSocket(){
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [from, setFrom] = useState('');
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        if (stompClient) {
            stompClient.connect({}, (frame) => {
                setConnected(true);
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/messages', (messageOutput) => {
                    showMessageOutput(JSON.parse(messageOutput.body));
                });
            });
        }
        // eslint-disable-next-line
    }, [stompClient]);

    const connect = () => {
        const socket = new SockJS('/chat');
        const client = Stomp.over(socket);
        setStompClient(client);
    };

    const disconnect = () => {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log('Disconnected');
    };

    const sendMessage = () => {
        stompClient.send(
            '/app/chat',
            {},
            JSON.stringify({ from: from, text: text })
        );
    };

    const showMessageOutput = (messageOutput) => {
        setResponse((prevResponse) => {
            return prevResponse + `${messageOutput.from}: ${messageOutput.text} (${
                messageOutput.time
            })\n`;
        });
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    id="from"
                    placeholder="Choose a nickname"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                />
            </div>
            <br />
            <div>
                <button id="connect" onClick={connect} disabled={connected}>
                    Connect
                </button>
                <button
                    id="disconnect"
                    onClick={disconnect}
                    disabled={!connected}
                >
                    Disconnect
                </button>
            </div>
            <br />
            <div id="conversationDiv" style={{ visibility: connected ? 'visible' : 'hidden' }}>
                <input
                    type="text"
                    id="text"
                    placeholder="Write a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button id="sendMessage" onClick={sendMessage}>
                    Send
                </button>
                <p id="response">{response}</p>
            </div>
        </div>
    );
};

// export default ChatWebSocket;
