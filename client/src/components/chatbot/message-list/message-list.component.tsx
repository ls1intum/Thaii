import {
  Avatar,
  Grid,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { User } from "react-feather";
import Robot from "../../../assets/robot.png";
import Markdown from "react-markdown";
import {
  MessageDTO,
  MessageListComponent,
} from "../../../types/chatbot/chatbot.types";
import { useEffect, useRef } from "react";

function MessageList({ messages, request, loading }: MessageListComponent) {
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  if (messages.length == 0 && !loading) {
    return (
      <Box sx={{ position: "fixed", top: "50%", left: "60%" }}>
        <Typography variant="body1">
          Start chatting by asking the chatbot!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {messages.map((message: MessageDTO, index: number) => {
        return (
          <>
            <Grid item xs={12} key={message.id + "request"}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <Avatar sx={{ width: 26, height: 26 }}>
                  <User />
                </Avatar>
                <Stack direction="column">
                  <Typography variant="body2" color="#5a5a5a">
                    <b>You</b>
                  </Typography>
                  <Typography variant="body2" color="#5a5a5a">
                    {message.request}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              key={message.id + "response"}
              ref={index === messages.length - 1 ? scrollRef : null}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <Avatar
                  sx={{ bgcolor: "white", width: 26, height: 26 }}
                  src={Robot}
                />
                <Stack direction="column">
                  <Typography variant="body2" color="#5a5a5a">
                    <b>ChatBot</b>
                  </Typography>
                  <Typography variant="body2" color="#5a5a5a">
                    <Markdown>{message.response}</Markdown>
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </>
        );
      })}
      {loading && (
        <>
          <Grid item xs={12} key={"request"}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: "flex", alignItems: "flex-start" }}
            >
              <Avatar sx={{ width: 26, height: 26 }}>
                <User />
              </Avatar>
              <Stack direction="column">
                <Typography variant="body2" color="#5a5a5a">
                  <b>You</b>
                </Typography>
                <Typography variant="body2" color="#5a5a5a">
                  {request}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} key={"response"} ref={scrollRef}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: "flex", alignItems: "flex-start" }}
            >
              <Avatar
                sx={{ bgcolor: "white", width: 26, height: 26 }}
                src={Robot}
              />
              <Stack direction="column">
                <Typography variant="body2" color="#5a5a5a">
                  <b>ChatBot</b>
                </Typography>
                <CircularProgress sx={{ color: "#5a5a5a" }} size={20} />
              </Stack>
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default MessageList;
