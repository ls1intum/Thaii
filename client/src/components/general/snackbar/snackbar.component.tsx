import { Alert, Snackbar } from "@mui/material";
import { SnackbarParams } from "./types/snackbar.types";

function CustomSnackbar({ message, type, open, handleClose }: SnackbarParams) {

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={type === "success" ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%", zIndex: 2000 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar
