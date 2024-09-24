export type InputError = {
    error: boolean;
    errorMessage: string;
}

export type SnackbarParams = {
    message: string;
    type: string;
    open: boolean;
    handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  };
  