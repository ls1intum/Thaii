import {
  Stack,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from "@mui/material";
import { Info } from "react-feather";

function PasswordStrengthInfo() {
  const theme = useTheme();

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" arrow/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <Stack direction="row" spacing={1}>
    <Typography variant="caption" color={theme.palette.primary.dark}>
        Password Information
    </Typography>
    <HtmlTooltip
      title={
        <>
          <Stack direction="column">
            <Typography variant="caption" color={theme.palette.primary.dark}>
              <b>Your password must:</b>
            </Typography>
            <Typography variant="caption" color={theme.palette.primary.dark}>
              - Have at least 8 characters.
            </Typography>
            <Typography variant="caption" color={theme.palette.primary.dark}>
              - Include at least one letter and one number
            </Typography>
          </Stack>
        </>
      }
      placement="top"
    >
      <Info color={theme.palette.primary.dark} size={17}/>
    </HtmlTooltip>
    </Stack>
  );
}

export default PasswordStrengthInfo;
