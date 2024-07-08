import { Avatar, Stack } from "@mui/material";
import { ColorSelectorParams } from "../../types/creation-dialog.types";
import { Check, Circle } from "react-feather";

const colors = [
  "#DDFFDE",
  "#FFCACA",
  "#E0E7FF",
  "#FFB077",
  "#9DEFFB",
  "#FB9DF7",
];

function ColorSelector({ color, setColor }: ColorSelectorParams) {
  return (
    <Stack direction="row" spacing={1}>
      {colors.map((color_item: string) => {
        return (
          <Avatar
            sx={{
              width: 20,
              height: 20,
              padding: "2px",
              bgcolor: color_item,
              border: color_item === color ? "1px solid #5a5a5a" : 0,
              ":hover": { cursor: "pointer" },
            }}
            onClick={() => setColor(color_item)}
          >
            {color_item === color ? (
              <Check color="#5a5a5a" />
            ) : (
              <Circle color={color_item} />
            )}
          </Avatar>
        );
      })}
    </Stack>
  );
}

export default ColorSelector;
