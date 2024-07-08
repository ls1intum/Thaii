import Box from "@mui/material/Box";
import {
  Paper,
  Typography,
  Chip,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import { Edit } from "react-feather";
import { ChatDTO, LabelDTO } from "../../../types/chatbot/chatbot.types";
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { editChat } from "../../../services/chats.service";
import { deleteChat } from "../../../api/chat.api";
import CreationDialog from "../../general/create-dialog/creation-dialog.component";
import { useToolStore } from "../../../states/global.store";
import { useNavigate } from "react-router-dom";

function ChatTable({
  chats,
  fetchChatsByPageId,
  currentPageId,
  setSnackbar,
}: any) {
  const theme = useTheme();
  const navigate = useNavigate();
  const setCurrentChatId = useToolStore((state: any) => state.setCurrentChatId);
  const [open, setOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ChatDTO | null>(null);
  const [title, setTitle] = useState<string>("");
  const [parentId, setParentId] = useState<number>(-1);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Title"}</b>,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{ ":hover": { cursor: "pointer" } }}
          onClick={() => {
            setCurrentChatId(params.row.id);
            navigate("/");
          }}
        >
          {params.row.title}
        </Typography>
      ),
    },
    {
      field: "labels",
      headerName: "Labels",
      flex: 4,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Labels"}</b>,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            padding: "0.5rem",
            overflowX: "auto",
          }}
        >
          {params.value.map((label: LabelDTO) => (
            <Chip
              key={label.id}
              label={label.label}
              sx={{
                backgroundColor: label.color,
                mr: "0.25rem",
                mb: "0.25rem",
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "created_at",
      headerName: "Created at",
      flex: 2,
      headerClassName: "super-app-theme--header",
      type: "string",
      valueGetter: (_value, row) => `${new Date(row.created_at).toDateString()}`,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Created at "}</b>,
    },
    {
      field: "edit",
      headerName: "",
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          sx={{ border: "none" }}
          onClick={() => {
            setCurrentRow(params.row);
            setOpen(true);
          }}
        >
          <Edit />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    if (currentRow) {
      setTitle(currentRow.title);
      setParentId(currentPageId);
      handleLabels();
      console.log(loading)
    }
  }, [open]);

  const handleLabels = () => {
    if (currentRow) {
      setSelectedLabels(
        currentRow.labels.map((element: LabelDTO) => element.id)
      );
    }
  };

  const handleEditChat = async () => {
    setLoading(true);
    if (currentRow) {
      editChat(currentRow.id, {
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
        .then(() => {})
        .catch(() => {
          setSnackbar({
            message: "Error: Chat could not be edited.",
            type: "error",
            open: true,
          });
        })
        .finally(() => {
          fetchChatsByPageId(currentPageId);
          setLoading(false);
        });
    }
  };

  const handleDeleteChat = async () => {
    if (currentRow) {
      deleteChat(currentRow.id)
        .then(() => {
          setSnackbar({
            message: "Chat successfully deleted.",
            type: "success",
            open: true,
          });
        })
        .then(() => {})
        .catch(() => {
          setSnackbar({
            message: "Error: Chat could not be deleted.",
            type: "error",
            open: true,
          });
        })
        .finally(() => fetchChatsByPageId(currentPageId));
    }
  };

  if (chats.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40vh",
        }}
      >
        <Typography variant="body1" color="#5f5f5f">
          You have no Chats for this Page!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container>
        <Typography variant="h6" color="#5a5a5a">
          <b>My Chats</b>
        </Typography>
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              height: "65vh",
              width: "100%",
              mt: "1rem",
            }}
          >
            <DataGrid
              rows={chats}
              columns={columns}
              getRowHeight={() => "auto"}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              sx={{
                pl: "0.5rem",
                pr: "0.5rem",
                "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                  color: theme.palette.secondary.dark,
                  alignContent: "center",
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
      <CreationDialog
        open={open}
        setOpen={setOpen}
        label={title}
        setLabel={setTitle}
        parentId={parentId}
        setParentId={setParentId}
        editItem={handleEditChat}
        deleteItem={handleDeleteChat}
        selectedElements={currentRow?.labels}
        selectedTagOrLabel={selectedLabels}
        setSelectedTagOrLabel={setSelectedLabels}
        type="edit"
        source="chat"
      />
    </>
  );
}

export default ChatTable;
