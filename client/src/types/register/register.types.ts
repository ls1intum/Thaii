import { InputError } from "../general/general.types";

export type UserBody = {
    username: string;
    password: string;
}

export type UserDTO = {
    id: number;
    username: string;
    is_active: boolean;
    is_staff: boolean;
}

export type WhitelistDTO = {
    id: number;
    email: string;
}

export type ActivationBody = {
    uidb64: string,
    token: string
}

export type EmailFieldParams = {
    email: string;
    setEmail: (email: string) => void;
    error: InputError;
}

export type PasswordFieldsParams = {
    password: string;
    setPassword: (password: string) => void;
    confirmedPassword: string;
    setConfirmedPassword: (comfirmedPassword: string) => void;
    error: InputError;
}
