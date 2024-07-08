import { useEffect, useState } from "react";
import {
  ChatTitleParams,
  LabelDTO,
} from "../../../types/chatbot/chatbot.types";
import { editChat } from "../../../services/chats.service";
import { deleteChat } from "../../../api/chat.api";
import LoadingComponent from "../../general/loading-component/loading.component";
import { Box, Chip, Grid, IconButton, Typography } from "@mui/material";
import { Edit } from "react-feather";
import CreationDialog from "../../general/create-dialog/creation-dialog.component";
import { useToolStore } from "../../../states/global.store";
import { useNavigate } from "react-router-dom";

function ChatTitle({
  currentChat,
  fetchChatById,
  fetchChatData,
  setSnackbar,
}: ChatTitleParams) {
  const navigate = useNavigate();
  const setCurrentPageId = useToolStore((state: any) => state.setCurrentPageId);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [parentId, setParentId] = useState<number>(-1);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTitle(currentChat.title);
    setParentId(+currentChat.page.id);
    handleLabels();
  }, [open]);

  const handleOpen = () => {
    setOpen((open) => !open);
  };

  const handleLabels = () => {
    setSelectedLabels(
      currentChat.labels.map((element: LabelDTO) => element.id)
    );
  };

  const handleEditChat = async () => {
    setLoading(true);
    editChat(+currentChat.id, {
      title: title,
      page: parentId,
      labels: selectedLabels,
    })
      .then(() => {
        setSnackbar({
          message: "Chat successfully edited.",
          type: "success",
          open: true,
        });
      })
      .then(() => {
        fetchChatData();
        fetchChatById(+currentChat.id);
      })
      .catch(() => {
        setSnackbar({
          message: "Error: Chat could not be edited.",
          type: "error",
          open: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteChat = async () => {
    deleteChat(+currentChat.id)
      .then(() => {
        setSnackbar({
          message: "Chat successfully deleted.",
          type: "success",
          open: true,
        });
      })
      .then(() => {
        fetchChatData();
      })
      .catch(() => {
        setSnackbar({
          message: "Error: Chat could not be deleted.",
          type: "error",
          open: true,
        });
      });
  };

  const handleTitleClick = (pageId: string) => {
    setCurrentPageId(pageId);
    navigate("/pages");
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Grid container sx={{ mt: "2vh", ml: "2vw" }}>
        <Grid
          item
          xs={8}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Typography variant="h5" color="#5a5a5a">
            <b>{currentChat.title}</b>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={handleOpen}
            style={{ border: "none", outline: "none" }}
          >
            <Edit />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Typography
            variant="h6"
            color="#7f7f7f"
            sx={{ ":hover": { cursor: "pointer" } }}
            onClick={() => handleTitleClick(currentChat.page.id)}
          >
            <b>{currentChat.page.label}</b>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: "1.5vh",
          }}
        >
          <Box sx={{ maxHeight: "5vh", overflow: "auto" }}>
            {currentChat.labels.map((label: any) => {
              return (
                <Chip
                  key={label.id}
                  label={
                    <Typography variant="body2" color="#5a5a5a">
                      <b>{label.label}</b>
                    </Typography>
                  }
                  size="small"
                  sx={{
                    backgroundColor: label.color,
                    mr: "0.25rem",
                    mb: "0.25rem",
                  }}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: "1vh",
            mr: "4vw",
            borderBottom: "solid 1px #d6d6d6",
          }}
        ></Grid>
      </Grid>
      <CreationDialog
        open={open}
        setOpen={setOpen}
        label={title}
        setLabel={setTitle}
        parentId={parentId}
        setParentId={setParentId}
        selectedElements={currentChat.labels}
        selectedTagOrLabel={selectedLabels}
        setSelectedTagOrLabel={setSelectedLabels}
        editItem={handleEditChat}
        deleteItem={handleDeleteChat}
        type="edit"
        source="chat"
      />
    </>
  );
}

export default ChatTitle;
