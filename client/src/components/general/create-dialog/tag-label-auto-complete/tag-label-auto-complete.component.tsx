import {
  Autocomplete,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import { CheckSquare, Square, Trash } from "react-feather";
import { SyntheticEvent, useState } from "react";
import { TagLabelListParams } from "../../../../types/create-dialog/creation-dialog.types";
import { LabelDTO } from "../../../../types/chatbot/chatbot.types";
import { TagDTO } from "../../../../types/page/page.types";
import CustomSnackbar from "../../snackbar/snackbar.component";
import LoadingComponent from "../../loading-component/loading.component";
import { removeTag } from "../../../../services/tags.service";
import { removeLabel } from "../../../../services/label.service";

function TagLabelAutoComplete({
  elements,
  currentElements,
  setCurrentElements,
  selectedTagsOrLabels,
  setSelectedTagsOrLabels,
  fetchTagOrLabelData,
  source,
}: TagLabelListParams) {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });
  const [loading, setLoading] = useState(false);

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

  const handleChange = (_event: SyntheticEvent<Element, Event>, value: any) => {
    setSelectedTagsOrLabels(
      value.map((element: TagDTO | LabelDTO) => element.id)
    );
    setCurrentElements(value);
  };

  const handleDeleteElement = async (id: number) => {
    setLoading(true);
    if (source == "chat") {
      removeLabel(id)
        .then(() => {
          setSnackbar({
            message: "Label successfully deleted.",
            type: "success",
            open: true,
          });
        })
        .then(() => {})
        .catch(() => {
          setSnackbar({
            message: "Error: Label could not be deleted.",
            type: "error",
            open: true,
          });
        })
        .finally(() => {
          fetchTagOrLabelData();
          setLoading(false);
        });
    } else {
      removeTag(id)
        .then(() => {
          setSnackbar({
            message: "Tag successfully deleted.",
            type: "success",
            open: true,
          });
        })
        .then(() => {})
        .catch(() => {
          setSnackbar({
            message: "Error: Tag could not be deleted.",
            type: "error",
            open: true,
          });
        })
        .finally(() => {
          fetchTagOrLabelData();
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Autocomplete
        freeSolo
        multiple
        disableClearable
        limitTags={3}
        size="small"
        fullWidth
        onChange={handleChange}
        ListboxProps={{ style: { maxHeight: "20vh" } }}
        options={elements}
        disableCloseOnSelect
        defaultValue={currentElements}
        getOptionLabel={(option: TagDTO | LabelDTO | any) => option.label}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                label={option.label}
                sx={{ backgroundColor: option.color }}
                size="small"
                key={key}
                {...tagProps}
              />
            );
          })
        }
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Grid container>
              <Grid
                item
                xs={10}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  icon={<Square size="16px" />}
                  checkedIcon={<CheckSquare size="16px" />}
                  style={{ marginRight: 8 }}
                  checked={selected || selectedTagsOrLabels.includes(option.id)}
                />
                {option.label}
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <IconButton
                  size="small"
                  onMouseDown={() => handleDeleteElement(option.id)}
                >
                  <Trash size="20" />
                </IconButton>
              </Grid>
            </Grid>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Search for a tag..."
            sx={{
              maxHeight: "10vh",
              overflowY: "auto",
              border: `solid 1px ${theme.palette.secondary.main}`,
              "& fieldset": { border: "none" },
            }}
          />
        )}
      />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        handleClose={handleClose}
      />
    </>
  );
}

export default TagLabelAutoComplete;
