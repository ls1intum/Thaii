import { Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import { ChatListParams } from "../../../types/chatbot/chatbot.types";
import React, { useEffect, useState } from "react";
import { getChatsCount } from "../../../services/chats.service";

function ChatList({
  chats,
  currentChatId,
  setCurrentChatId,
  limit,
  setLimit,
}: ChatListParams) {
  const theme = useTheme();
  const uniqueDates = [
    ...new Set(
      chats.map((item: any) => new Date(item.created_at).toDateString())
    ),
  ];
  const [chatCount, setChatCount] = useState<number>(0);

  useEffect(() => {
    getChatsCount().then((res) => setChatCount(res));
  }, []);

  if (!chats) {
    return (
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Typography>You do not have any Chats!</Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1} key="container">
      {uniqueDates.map((date: any) => (
        <React.Fragment key={date}>
          <Grid item xs={12} sx={{ mt: "1vh" }}>
            <Typography variant="body2" color={theme.palette.primary.dark}>
              <b>{date}</b>
            </Typography>
          </Grid>
          {chats
            .filter((chat: any) => {
              if (new Date(chat.created_at).toDateString() == date) {
                return chat;
              }
            })
            .map((item: any) => {
              return (
                <Grid item xs={12} key={item.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      border:
                        currentChatId === item.id
                          ? `solid 2px ${theme.palette.primary.dark}`
                          : 0,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      padding: "5px",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => setCurrentChatId(item.id)}
                  >
                    <Grid container>
                      <Grid item xs={12} sx={{ paddingLeft: "3px" }}>
                        <Typography
                          variant="body2"
                          color={theme.palette.primary.dark}
                        >
                          <b>{item.page.label}</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          color={theme.palette.secondary.dark}
                        >
                          <b>{item.title}</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              );
            })}
        </React.Fragment>
      ))}
      {chats.length < chatCount && (
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", mt: "1rem" }}
          key="item_button"
        >
          <Button
            key="button"
            variant="outlined"
            color="inherit"
            sx={{
              border: "solid 2px #5a5a5a",
              background: "#f5f5f5",
              mr: "5px",
              borderRadius: 4,
            }}
            onClick={() => setLimit(limit + 5)}
          >
            <Typography
              key="load_more"
              variant="body2"
              color={theme.palette.secondary.dark}
            >
              <b key="text_load_more">Load More</b>
            </Typography>
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default ChatList;
