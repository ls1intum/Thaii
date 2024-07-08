import {
  Button,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { Mail, Trash2 } from "react-feather";
import { WhitelistTableParams } from "../../../types/admin-table/admin-table.types";
import { useState } from "react";
import {
  addEmailToWhitelist,
  deleteWhitelistItem,
} from "../../../services/user.service";
import CustomSnackbar from "../../general/snackbar/snackbar.component";
import "../styles/admin-table.styles.css";

function WhitelistTable({
  whitelisted_emails,
  fetchWhitelist,
}: WhitelistTableParams) {
  const theme = useTheme();
  const [email, setEmail] = useState<string>("");
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });
  const handleDeleteClick = (id: number) => {
    deleteWhitelistItem(id)
      .then(() =>
        setSnackbar({
          message: "Successfully deleted email!",
          type: "success",
          open: true,
        })
      )
      .catch((error: string) =>
        setSnackbar({ message: error, type: "error", open: true })
      )
      .finally(() => fetchWhitelist());
  };
  const handleAddEmail = () => {
    addEmailToWhitelist(email)
      .then(() =>
        setSnackbar({
          message: "Successfully added email to whitelist!",
          type: "success",
          open: true,
        })
      )
      .catch((error: string) =>
        setSnackbar({ message: error, type: "error", open: true })
      )
      .finally(() => fetchWhitelist());
  };
  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 4,
      type: "string",
      sortable: true,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Email"}</b>,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Delete",
      flex: 1,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Delete"}</b>,
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<Trash2 />}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
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
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="row">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Add email to whitelist..."
              className="whitelist-add-textfield"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{
                "& fieldset": { border: "none" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              className="whitelist-add-button"
              onClick={handleAddEmail}
              sx={{ backgroundColor: theme.palette.secondary.main }}
            >
              <Typography variant="body2" color={theme.palette.secondary.dark}>
                <b>Add</b>
              </Typography>
            </Button>
          </Stack>
        </Grid>
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
              rows={whitelisted_emails}
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
      <CustomSnackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        handleClose={handleClose}
      />
    </>
  );
}

export default WhitelistTable;
