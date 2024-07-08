import {
  Box,
  Grid,
  Typography,
  TextField,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { SidebarParams } from "../sidebar/types/sidebar.types";
import "../layout/styles/layout.styles.css";
import { ArrowUpCircle, Edit } from "react-feather";
import { lazy, Suspense, useEffect, useState } from "react";
import CustomSnackbar from "../general/snackbar/snackbar.component";
import { ChatDTO, MessageDTO } from "../../types/chatbot/chatbot.types";
import { addChat, getChatById, getChats } from "../../services/chats.service";
import { addMessage, getMessages } from "../../services/message.service";
import LoadingComponent from "../general/loading-component/loading.component";
import { useToolStore } from "../../states/global.store";
import { getPages } from "../../services/pages.service";
import "./styles/chatbot.styles.css";
import EmptyChat from "../general/empty-chat/empty-chat.component";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "../general/error-boundary/error-boundary.component";
import CreationDialog from "../general/create-dialog/creation-dialog.component";
import { useQuery } from "react-query";
const ChatList = lazy(() => import("./chat-list/chat-list.component"));
const ChatTitle = lazy(() => import("./chat-title/chat-title.component"));
const MessageList = lazy(() => import("./message-list/message-list.component"));

function Chatbot({ open }: SidebarParams) {
  const theme = useTheme();
  const [currentChat, setCurrentChat] = useState<ChatDTO | null>(null);
  const [parentId, setParentId] = useState(-1);
  const [title, setTitle] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const setPages = useToolStore((state: any) => state.setPages);
  const currentChatId = useToolStore((state: any) => state.currentChatId);
  const setCurrentChatId = useToolStore((state: any) => state.setCurrentChatId);
  const limit = useToolStore((state: any) => state.limit);
  const setLimit = useToolStore((state: any) => state.setLimit);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [request, setRequest] = useState<string>("");
  const [, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({
      message: snackbar.message,
      type: snackbar.type,
      open: false,
    });
  };

  const { data: pagesData } = useQuery('pages', getPages);
  const { data: chatsData } = useQuery(['chats', limit], () => getChats(limit));
  const { data: chatById } = useQuery(['chatById', currentChatId], () => fetchChatById(currentChatId), {
    enabled: currentChatId !== -1,
  });
  const { data: messagesData } = useQuery(['messages', currentChatId], () => fetchMessages(currentChatId), {
    enabled: currentChatId !== -1,
  });

  useEffect(() => {
    if(pagesData) {
      setPages(pagesData)
    }
  }, [pagesData, setPages]);

  useEffect(() => {
    if(chatsData) {
      setChats(chatsData)
    }
  }, [chatsData, setChats]);

  useEffect(() => {
    if(messagesData) {
      setMessages(messagesData)
    }
  }, [messagesData, setMessages])

  useEffect(() => {
    if(chatById) {
      setCurrentChat(chatById)
    }
  }, [chatById, setCurrentChat]);

  const fetchChatById = async (chatId: number) => {
    setLoading(true);
    getChatById(chatId)
      .then((res: ChatDTO) => setCurrentChat(res))
      .finally(() => setLoading(false));
  };

  const fetchMessages = async (chatId: number) => {
    setLoading(true);
    getMessages(chatId)
      .then((res: MessageDTO[]) => setMessages(res))
      .finally(() => setLoading(false));
  };

  const fetchChatsData = async () => {
    setLoading(true);
    getChats(limit)
      .then((res: ChatDTO[]) => setChats(res))
      .finally(() => setLoading(false));
  };


  const sendMessage = async () => {
    setMessageLoading(true);
    addMessage(currentChatId, {
      request: request,
    })
      .catch(() => {
        setRequest(request);
        setSnackbar({
          message: "Error: Message could not be created",
          type: "error",
          open: true,
        });
      })
      .finally(() => {
        fetchMessages(currentChatId).then(() => {
          setRequest("");
          setMessageLoading(false);
        });
      });
  };

  const handleAddChat = async () => {
    addChat({
      title: title,
      page: parentId,
      labels: selectedLabels,
    })
      .then(() => {
        setSnackbar({
          message: "Chat successfully created",
          type: "success",
          open: true,
        });
      })
      .then(() => fetchChatsData())
      .catch(() => {
        setSnackbar({
          message: "Error: Chat could not be created",
          type: "error",
          open: true,
        });
      });
  };
  return (
    <div className={open ? "chat open" : "chat close"}>
      <Grid container>
        <Grid item xs={2.5} className="chatlist-outer-grid-item">
          <Grid container className="chatlist-inner-grid-container">
            <Grid item xs={12}>
              <Button
                variant="outlined"
                className="button-new-chat"
                sx={{ backgroundColor: theme.palette.secondary.main }}
                onClick={() => setDialogOpen(true)}
              >
                <Grid container className="button-new-chat-grid">
                  <Typography
                    variant="body2"
                    color={theme.palette.secondary.dark}
                  >
                    <b>New Chat</b>
                  </Typography>
                  <Edit color={theme.palette.secondary.dark} />
                </Grid>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box className="chatlist-box">
                <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                  <Suspense fallback={<LoadingComponent />}>
                    <ChatList
                      chats={chats}
                      currentChatId={currentChatId}
                      setCurrentChatId={setCurrentChatId}
                      limit={limit}
                      setLimit={setLimit}
                    />
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9.5}>
          {!currentChat ? (
            <EmptyChat message={`Create a new chat to start chatting or choosing an existing one.`}/>
          ) : (
            <Grid container sx={{ mt: "4vh" }}>
              <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                <Suspense fallback={<LoadingComponent />}>
                  <ChatTitle
                    currentChat={currentChat}
                    fetchChatData={fetchChatsData}
                    fetchChatById={fetchChatById}
                    setSnackbar={setSnackbar}
                  />
                </Suspense>
              </ErrorBoundary>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  ml: "2vw",
                  mb: "2vh",
                  mt: "4vh",
                }}
              >
                <Stack direction="column">
                  <Box sx={{ overflowY: "auto", height: "60vh", pb: "3rem" }}>
                    <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                      <Suspense fallback={<LoadingComponent />}>
                        <MessageList
                          messages={messages}
                          loading={messageLoading}
                          request={request}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  </Box>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  variant="outlined"
                  value={messageLoading ? "" : request}
                  onChange={(e: any) => {
                    messageLoading ? "" : setRequest(e.target.value);
                  }}
                  multiline
                  size="small"
                  placeholder="Ask Chatbot..."
                  maxRows={4}
                  sx={{
                    position: "absolute",
                    bottom: "6vh",
                    width: "30vw",
                    border: "solid 1px #f3f3f3",
                    backgroundColor: "white",
                    "& fieldset": { border: "none" },
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => sendMessage()}
                          style={{ border: "none", outline: "none" }}
                        >
                          <ArrowUpCircle />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <CreationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        label={title}
        setLabel={setTitle}
        parentId={parentId}
        setParentId={setParentId}
        createItem={handleAddChat}
        selectedTagOrLabel={selectedLabels}
        setSelectedTagOrLabel={setSelectedLabels}
        type="create"
        source="chat"
      />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        handleClose={handleClose}
      />
    </div>
  );
}

export default Chatbot;
