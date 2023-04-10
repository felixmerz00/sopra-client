import {Fragment, useState, useRef, useEffect} from 'react';
import 'styles/views/Login.scss';
import 'styles/views/Chat.css';
import {Box, Divider, Typography, ListItemText, Container, Paper, Grid, List, ListItem, FormControl, TextField, IconButton} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {ChatMessageDTO} from "../../models/ChatMessageDTO";


export default function Login()  {


  const ENTER_KEY_CODE = 13;

  const scrollBottomRef = useRef(null);
  const webSocket = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Opening WebSocket');
    webSocket.current = new WebSocket('ws://localhost:8080/login');
    const openWebSocket = () => {
      webSocket.current.onopen = (event) => {
        console.log('Open:', event);
      }
      webSocket.current.onclose = (event) => {
        console.log('Close:', event);
      }
    }
    openWebSocket();
    return () => {
      console.log('Closing WebSocket');
      webSocket.current.close();
    }
  }, []);

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      const ChatMessageDTO = JSON.parse(event.data);
      console.log('Message:', ChatMessageDTO);
      setChatMessages([...chatMessages, {
        user: ChatMessageDTO.user,
        message: ChatMessageDTO.message
      }]);
      if(scrollBottomRef.current) {
        scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
      }
    }
  }, [chatMessages]);

  const handleUserChange = (event) => {
    setUser(event.target.value);
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const handleEnterKey = (event) => {
    if(event.keyCode === ENTER_KEY_CODE){
      sendMessage();
    }
  }

  const sendMessage = () => {
    if(user && message) {
      console.log('Send!');
      webSocket.current.send(
          JSON.stringify(new ChatMessageDTO(user, message))
      );
      // Clear input after sending the message
      setMessage('');
    }
  };

  const listChatMessages = chatMessages.map((ChatMessageDTO, index) =>
      <ListItem key={index}>
        <ListItemText primary={`${ChatMessageDTO.user}: ${ChatMessageDTO.message}`}/>
      </ListItem>
  );


  return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <Fragment>
            <Container>
              <Paper elevation={5} >
                <Box p={5}>
                  <Typography variant="h6" gutterBottom>
                    Happy chatting!
                  </Typography>
                  <Divider />
                  <Grid container spacing={4} alignItems="center">
                    <Grid id="chat-window" xs={12} item>
                      <List id="chat-window-messages">
                        {listChatMessages}
                        <ListItem ref={scrollBottomRef}></ListItem>
                      </List>
                    </Grid>
                    <Grid xs={2} item>
                      <FormControl fullWidth>
                        <TextField onChange={handleUserChange}
                                   value={user}
                                   label="Nickname"
                                   variant="outlined"/>
                      </FormControl>
                    </Grid>
                    <Grid xs={9} item>
                      <FormControl fullWidth>
                        <TextField onChange={handleMessageChange} onKeyDown={handleEnterKey}
                                   value={message}
                                   label="Type your message..."
                                   variant="outlined"/>
                      </FormControl>
                    </Grid>
                    <Grid xs={1} item>
                      <IconButton onClick={sendMessage}
                                  aria-label="send"
                                  color="primary">
                        <SendIcon />
                      </IconButton>
                    </Grid>

                  </Grid>
                </Box>
              </Paper>
            </Container>
          </Fragment>
        </Box>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
// export default Login;
