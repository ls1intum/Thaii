export type SnackbarParams = {
  message: string;
  type: string;
  open: boolean;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
};
