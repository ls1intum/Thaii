import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  useTheme,
} from "@mui/material";
import { CheckSquare, Square } from "react-feather";
import { SyntheticEvent } from "react";
import { TagLabelListParams } from "../../../../types/create-dialog/creation-dialog.types";
import { LabelDTO } from "../../../../types/chatbot/chatbot.types";
import { TagDTO } from "../../../../types/page/page.types";

function TagLabelAutoComplete({
  elements,
  currentElements,
  setCurrentElements,
  selectedTagsOrLabels,
  setSelectedTagsOrLabels,
}: TagLabelListParams) {
  const theme = useTheme();

  const handleChange = (_event: SyntheticEvent<Element, Event>, value: any) => {
    setSelectedTagsOrLabels(
      value.map((element: TagDTO | LabelDTO) => element.id)
    );
    setCurrentElements(value);
  };

  return (
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
          <Checkbox
            icon={<Square size="16px" />}
            checkedIcon={<CheckSquare size="16px" />}
            style={{ marginRight: 8 }}
            checked={selected || selectedTagsOrLabels.includes(option.id)}
          />
          {option.label}
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
  );
}

export default TagLabelAutoComplete;
