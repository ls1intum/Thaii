import { useEffect, useState } from "react";
import { TagLabelDialogParams } from "../types/creation-dialog.types";
import { addTag } from "../../../../services/tags.service";
import { TagBody } from "../../../pages/types/pages.types";
import {
  Button,
  Fade,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ColorSelector from "./color-selector/color-selector.component";
import CustomSnackbar from "../../snackbar/snackbar.component";
import { addLabel } from "../../../../services/label.service";

function TagLabelDialog({
  open,
  setOpen,
  anchor,
  fetchTagsOrLabels,
  source,
}: TagLabelDialogParams) {
  const [label, setLabel] = useState<string>("");
  const [color, setColor] = useState<string>("#DDFFDE");
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });
  const [error, setError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: "",
  });

  useEffect(() => {
    setError({
      error: false,
      message: "",
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setLabel("");
    setColor("#DDFFDE");
    setError({
      error: false,
      message: "",
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(event.target.value.length > 100) {
      setError({
        error: true,
        message: "Oops! The maximal length of the title is 100 characters.",
      });
    } 
    setLabel(event.target.value);
  };

  const handleAdd = async (newItem: TagBody) => {
    if (newItem.label.length > 100) {
      setError({
        error: true,
        message: "Oops! The title should not longer than 50 characters.",
      });
      return;
    }
    if (newItem.label === "") {
      setError({
        error: true,
        message: "Oops! Please provide a title..",
      });
      return;
    }

    if (source === "chat") {
      addLabel(newItem)
        .then(() => {
          setSnackbar({
            message: "Label successfully created",
            type: "success",
            open: true,
          });
        })
        .then(() => fetchTagsOrLabels())
        .catch((error) => {
          setSnackbar({
            message: `Error: ${error}`,
            type: "error",
            open: true,
          });
        })
        .finally(() => handleClose());
    } else {
      addTag(newItem)
        .then(() => {
          setSnackbar({
            message: "Tag successfully created",
            type: "success",
            open: true,
          });
        })
        .then(() => fetchTagsOrLabels())
        .catch((error) => {
          setSnackbar({
            message: `Error: ${error}`,
            type: "error",
            open: true,
          });
        })
        .finally(() => handleClose());
    }
  };

  const handleSnackbarClose = (
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
      <Popper
        sx={{ zIndex: 1800 }}
        open={open}
        anchorEl={anchor}
        placement={"right-start"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ minWidth: "20vw", maxWidth: "30vw" }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="#5a5a5a"
                    sx={{ mt: "1vh", ml: "1vw", mb: "1vh" }}
                  >
                    {source === "chat" ? <b>New Label</b> : <b>New Tag</b>}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    ml: "1vw",
                    mt: "1vh",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="#5a5a5a">
                    <b>Title:</b>
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{ mt: "1vh" }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={label}
                    onChange={handleChange}
                    placeholder="Enter a tag title..."
                    size="small"
                    sx={{
                      border: error.error ? "solid 1px red" : "solid 1px #f3f3f3",
                      "& fieldset": { border: "none" },
                    }}
                  />
                  {error.error && (
                    <Typography variant="caption" color="red">
                      {error.message}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    ml: "1vw",
                    mt: "1vh",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="#5a5a5a">
                    <b>Color:</b>
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{ mt: "1vh" }}>
                  <ColorSelector color={color} setColor={setColor} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: "1vh",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: "1vh", mb: "1vh", mr: "1vw" }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{
                        border: "solid 2px #5a5a5a",
                        background: "#f5f5f5",
                      }}
                      onClick={handleClose}
                    >
                      <Typography variant="body2" color="#5a5a5a">
                        <b>Cancel</b>
                      </Typography>
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        background: "#006eff",
                        border: 0,
                        "&:hover": {
                          background: "#00a2ff",
                          border: 0,
                        },
                      }}
                      onClick={() => handleAdd({ label, color })}
                    >
                      <Typography variant="body2" color="white">
                        <b>Create</b>
                      </Typography>
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        handleClose={handleSnackbarClose}
      />
    </>
  );
}

export default TagLabelDialog;
