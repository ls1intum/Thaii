import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnHeaderParams,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { UserTableParams } from "../../../types/admin-table/admin-table.types";
import { Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { Check, CheckCircle, Edit2, Save, X, XCircle } from "react-feather";
import { useState } from "react";
import "../styles/admin-table.styles.css";
import { editUser } from "../../../services/user.service";
import CustomSnackbar from "../../general/snackbar/snackbar.component";

function UserTable({ users, fetchUsers }: UserTableParams) {
  const theme = useTheme();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });
  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Email",
      flex: 4,
      type: "string",
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Email"}</b>,
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 2,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Status"}</b>,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          {params.value ? (
            <>
              <CheckCircle color="green" />
              <Typography variant="body2">Active</Typography>
            </>
          ) : (
            <>
              <XCircle color="red" />
              <Typography variant="body2">Inactive</Typography>
            </>
          )}
        </Stack>
      ),
      editable: true,
      type: "singleSelect",
      valueOptions: [
        {
          value: true,
          label: (
            <Stack direction="row" spacing={1}>
              <CheckCircle color="green" />
              <Typography variant="body2">Active</Typography>
            </Stack>
          ),
        },
        {
          value: false,
          label: (
            <Stack direction="row" spacing={1}>
              <XCircle color="red" />
              <Typography variant="body2">Inactive</Typography>
            </Stack>
          ),
        },
      ],
    },
    {
      field: "is_staff",
      headerName: "Is Admin",
      flex: 2,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Is Admin"}</b>,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? <Check /> : <X />,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        {
          value: true,
          label: <Check />,
        },
        {
          value: false,
          label: <X />,
        },
      ],
    },
    {
      field: "date_joined",
      headerName: "Joined at",
      flex: 2,
      type: "string",
      valueGetter: (_value, row) =>
        `${new Date(row.date_joined).toDateString()}`,
      renderHeader: (_params: GridColumnHeaderParams) => <b>{"Joined at"}</b>,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              className="user-grid-buttons"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<X />}
              label="Cancel"
              className="user-grid-buttons"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit2 />}
            label="Edit"
            className="user-grid-buttons"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    editUser(newRow.id, newRow.is_active, newRow.is_staff)
      .then(() =>
        setSnackbar({
          message: "Successfully changed user!",
          type: "success",
          open: true,
        })
      )
      .catch((error: string) =>
        setSnackbar({ message: error, type: "error", open: true })
      )
      .finally(() => fetchUsers());
      return updatedRow;
  };

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
          <Paper
            elevation={1}
            sx={{
              height: "65vh",
              width: "100%",
              mt: "1rem",
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              getRowHeight={() => "auto"}
              processRowUpdate={processRowUpdate}
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

export default UserTable;
