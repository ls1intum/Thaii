import { UserDTO, WhitelistDTO } from "../register/register.types"

export type UserTableParams = {
    users: UserDTO[];
    fetchUsers: () => void;
}

export type WhitelistTableParams = {
    whitelisted_emails: WhitelistDTO[];
    fetchWhitelist: () => void;
}