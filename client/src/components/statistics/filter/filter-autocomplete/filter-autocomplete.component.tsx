import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PageDTO, TagDTO } from "../../../pages/types/pages.types";
import { CheckSquare, Square } from "react-feather";
import { PagesFilterParams } from "../../../../types/statistics/statistics.types";
import { SyntheticEvent, useEffect } from "react";
import { LabelDTO } from "../../../../types/chatbot/chatbot.types";
import "../../styles/statistics.styles.css";

function FilterAutocomplete({
  elements,
  selectedElements,
  setSelectedElements,
  selectedItemId,
  setSelectedItemId,
  type,
  includeUnlabeled,
  setIncludeUnlabeled,
}: PagesFilterParams) {
  const theme = useTheme();

  useEffect(() => {
    setSelectedItemId(
      elements.map((element: PageDTO | LabelDTO | TagDTO) => element.id)
    );
    setSelectedElements(elements);
  },[elements, setSelectedElements, setSelectedItemId])

  const handleChange = (event: SyntheticEvent<Element, Event>, value: any) => {
    event.preventDefault();
    setSelectedElements(value);
    setSelectedItemId(value.map((element: PageDTO) => element.id));
  };

  const handleSelectAll = (event: SyntheticEvent<Element, Event>) => {
    event.preventDefault();
    setSelectedItemId(
      elements.map((element: PageDTO | LabelDTO | TagDTO) => element.id)
    );
    setSelectedElements(elements);
  };

  const handleUnselectAll = (event: SyntheticEvent<Element, Event>) => {
    event.preventDefault();
    setSelectedItemId([]);
    setSelectedElements([]);
  };

  const handleChangeChecked = (event: SyntheticEvent<Element, Event>) => {
    event.preventDefault();
    if (setIncludeUnlabeled) {
      setIncludeUnlabeled(!includeUnlabeled);
    }
  };

  return (
    <Autocomplete
      multiple
      className="filter pages"
      options={elements}
      onChange={handleChange}
      value={selectedElements}
      disableCloseOnSelect
      disableClearable
      getOptionLabel={(option: PageDTO | LabelDTO | TagDTO) => option.label}
      ListboxProps={{ style: { maxHeight: "30vh" } }}
      renderTags={() => null}
      PaperComponent={(paperProps) => {
        const { children, ...restPaperProps } = paperProps;
        return (
          <Paper {...restPaperProps}>
            {children}
            <Stack direction="column" justifyContent="center">
              {(type == "tags" || type == "labels") && (
                <FormGroup
                  sx={{ ml: "0.5rem" }}
                  onMouseDown={(e: SyntheticEvent<Element, Event>) =>
                    handleChangeChecked(e)
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<Square size="16px" />}
                        checkedIcon={<CheckSquare size="16px" />}
                        defaultChecked
                        size="small"
                        checked={includeUnlabeled}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Include objects without {type}
                      </Typography>
                    }
                  />
                </FormGroup>
              )}

              <Stack direction="row" justifyContent="space-between">
                <Button
                  className="autocomplete button"
                  onMouseDown={(e: SyntheticEvent<Element, Event>) =>
                    handleSelectAll(e)
                  }
                >
                  <Typography
                    variant="caption"
                    color={theme.palette.secondary.dark}
                  >
                    <b>Select All</b>
                  </Typography>
                </Button>
                <Button
                  className="autocomplete button"
                  onMouseDown={(e: SyntheticEvent<Element, Event>) =>
                    handleUnselectAll(e)
                  }
                >
                  <Typography
                    variant="caption"
                    color={theme.palette.secondary.dark}
                  >
                    <b>Unselect All</b>
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          </Paper>
        );
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <Checkbox
            icon={<Square size="20px" />}
            checkedIcon={<CheckSquare size="20px" />}
            style={{ marginRight: "0.5rem" }}
            checked={selectedItemId.includes(option.id)}
            size="small"
          />
          <Typography variant="body2">{option.label}</Typography>
        </li>
      )}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={`Select ${type}`}
          variant="outlined"
        />
      )}
    />
  );
}

export default FilterAutocomplete;
