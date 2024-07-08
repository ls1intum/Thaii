import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Slide,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { CreationDialogParams } from "./types/creation-dialog.types";
import { PlusCircle, X } from "react-feather";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { TagDTO } from "../../pages/types/pages.types";
import { getTags } from "../../../services/tags.service";
import { useToolStore } from "../../../states/global.store";
import { LabelDTO } from "../../../types/chatbot/chatbot.types";
import TagLabelDialog from "./tag-label-dialog/tag-label-dialog.component";
import { TransitionProps } from "@mui/material/transitions";
import { getLabels } from "../../../services/label.service";
import LoadingComponent from "../loading-component/loading.component";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "../error-boundary/error-boundary.component";
const PageTreeView = lazy(
  () => import("../../pages/page-tree-view/page-tree-view.component")
);
const TagLabelAutoComplete = lazy(
  () => import("./tag-label-auto-complete/tag-label-auto-complete.component")
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreationDialog({
  open,
  setOpen,
  label,
  setLabel,
  parentId,
  setParentId,
  selectedElements,
  selectedTagOrLabel,
  setSelectedTagOrLabel,
  createItem,
  editItem,
  deleteItem,
  type,
  source,
}: CreationDialogParams) {
  const theme = useTheme();
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [labels, setLabels] = useState<LabelDTO[]>([]);
  const pages = useToolStore((state: any) => state.pages);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentElements, setCurrentElements] = useState<TagDTO[] | LabelDTO[]>(
    []
  );
  const [error, setError] = useState<{ error: boolean; message: string }>({
    error: false,
    message: "",
  });

  const fetchTagOrLabelData = async () => {
    setLoading(true);
    if (source === "chat") {
      getLabels()
        .then((res: LabelDTO[]) => setLabels(res))
        .finally(() => setLoading(false));
      return;
    } else {
      getTags()
        .then((res: TagDTO[]) => setTags(res))
        .finally(() => setLoading(false));
      return;
    }
  };

  useEffect(() => {
    if(type === "create") {
      setSelectedTagOrLabel([]);
      setCurrentElements([])
    }
    if (type === "create" && source === "chat" && pages && pages.length > 0) {
      setParentId(pages[0].id);
    }
    if (selectedElements && type === "edit") {
      setCurrentElements(selectedElements);
    }
    fetchTagOrLabelData();
  }, [open]);

  const handleClose = () => {
    setLabel("");
    setParentId(-1);
    setOpen(false);
    setError({
      error: false,
      message: "",
    })
    setPopperOpen(false);
  };

  const handleCheck = () => {
    if (parentId == -1) {
      setParentId(pages[0].id);
    } else {
      setParentId(-1);
    }
  };

  const handlePopperClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopperOpen((prev: boolean) => !prev);
    setAnchorEl(event.currentTarget);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError({ error: false, message: "" });
    if (event.target.value.length > 100) {
      setError({
        error: true,
        message: "Oops! The maximal length of the title is 100 characters.",
      });
    }
    setLabel(event.target.value);
  };

  const handleCrud = (type: string) => {
    if (label.length === 0) {
      setError({ error: true, message: "Oops! Please provide a title." });
      return;
    }
    switch (type) {
      case "create":
        {
          createItem && createItem();
        }
        break;
      case "edit":
        {
          editItem && editItem();
        }
        break;
      case "delete":
        {
          deleteItem && deleteItem();
        }
        break;
    }
    handleClose();
  };

  const getDialogTitle = () => {
    return type === "create" && source === "page"
      ? "Create Page"
      : type === "create" && source === "chat"
      ? "Create Chat"
      : type === "edit" && source === "page"
      ? "Edit Page"
      : "Edit Chat";
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ color: "#d3d3d3" }}
      TransitionComponent={Transition}
      fullWidth={true}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main }}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h5" color={theme.palette.secondary.dark}>
              <b>{getDialogTitle()}</b>
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              style={{
                border: "none",
                outline: "none",
              }}
            >
              <X />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Grid
            item
            xs={2}
            sx={{ mt: "3vh", display: "flex", alignItems: "center" }}
          >
            <Typography variant="body1" color={theme.palette.secondary.dark}>
              <b>Title:</b>
            </Typography>
          </Grid>
          <Grid item xs={10} sx={{ mt: "3vh" }}>
            <TextField
              variant="outlined"
              value={label}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleLabelChange(event)
              }
              fullWidth
              placeholder="Enter a page title..."
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
            sx={{ mt: "1vh", display: "flex", alignItems: "flex-start" }}
          >
            <Typography variant="body1" color={theme.palette.secondary.dark}>
              {source === "chat" ? <b>Page:</b> : <b>Parent Page:</b>}
            </Typography>
          </Grid>
          <Grid item xs={10} sx={{ mt: "0.5vh" }}>
            <Box
              sx={{
                maxHeight: "20vh",
                overflow: "auto",
                border: "1px solid #f5f5f5",
                padding: "5px",
              }}
            >
              <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                <Suspense fallback={<LoadingComponent />}>
                  <PageTreeView
                    pages={pages}
                    currentPageId={parentId}
                    setCurrentPageId={setParentId}
                    isNewPage={type === "create" && source === "page"}
                    isEditMode={type === "edit" && source === "page"}
                  />
                </Suspense>
              </ErrorBoundary>
            </Box>
            {source === "page" && type === "create" && (
              <Stack
                direction="row"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  size="small"
                  checked={parentId == -1 || parentId == null}
                  onChange={handleCheck}
                />
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.dark}
                >
                  Create Page as Parent Page
                </Typography>
              </Stack>
            )}
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ mt: "1vh", display: "flex", alignItems: "center" }}
          >
            <Typography variant="body1" color={theme.palette.secondary.dark}>
              <b>Tags:</b>
            </Typography>
          </Grid>
          <Grid item xs={10} sx={{ mt: "1vh" }}>
            <Stack direction="row">
              {loading ? (
                <Skeleton variant="rectangular" height={"2vh"} />
              ) : (
                <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                  <Suspense fallback={<LoadingComponent />}>
                    <TagLabelAutoComplete
                      elements={source === "chat" ? labels : tags}
                      selectedElements={
                        selectedElements && type === "edit"
                          ? selectedElements
                          : []
                      }
                      currentElements={currentElements}
                      setCurrentElements={setCurrentElements}
                      selectedTagsOrLabels={selectedTagOrLabel}
                      setSelectedTagsOrLabels={setSelectedTagOrLabel}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              <IconButton
                aria-label="add-tag"
                size="large"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  handlePopperClick(event)
                }
                style={{ border: "none", outline: "none" }}
              >
                <PlusCircle />
              </IconButton>
              <TagLabelDialog
                open={popperOpen}
                setOpen={setPopperOpen}
                anchor={anchorEl}
                fetchTagsOrLabels={fetchTagOrLabelData}
                source={source}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-start" }}
          >
            {type === "edit" && deleteItem && (
              <Button
                variant="outlined"
                sx={{
                  background: "#f50057",
                  border: 0,
                  ml: "10px",
                  "&:hover": {
                    background: "#f73378",
                    border: 0,
                  },
                }}
                onClick={() => handleCrud("delete")}
              >
                <Typography variant="body2" color="white">
                  <b>Remove</b>
                </Typography>
              </Button>
            )}
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                border: "solid 2px #5a5a5a",
                background: "#f5f5f5",
                mr: "5px",
              }}
              onClick={handleClose}
            >
              <Typography variant="body2" color={theme.palette.secondary.dark}>
                <b>Cancel</b>
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                background: "#006eff",
                border: 0,
                mr: "10px",
                "&:hover": {
                  background: "#00a2ff",
                  border: 0,
                },
              }}
              onClick={() => handleCrud(type)}
            >
              <Typography variant="body2" color="white">
                {type === "create" ? <b>Create</b> : <b>Apply</b>}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export default CreationDialog;
