import { changeUser, createWhitelistEmail, deleteWhitelist, fetchUserPermission, fetchUsers, fetchWhitelist } from "../api/user.api";

export const getUsers = async () => {
  try {
    const response = await fetchUsers();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (id: number, is_active: boolean, is_staff: boolean) => {
  try {
    const response = await changeUser(id, is_active, is_staff);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getWhitelist = async () => {
  try {
    const response = await fetchWhitelist();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addEmailToWhitelist = async (email: string) => {
  try {
    const response = await createWhitelistEmail(email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWhitelistItem = async (id: number) => {
  try {
    const response = await deleteWhitelist(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPermissions = async () => {
  try {
    const response = await fetchUserPermission();
    return response.data;
  } catch (error) {
    throw error;
  }
};
