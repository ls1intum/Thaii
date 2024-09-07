import api from "./interceptor.api";

// Fetches all users from the API
// @returns The response from the API containing the list of all users
export const fetchUsers = async () => {
  try {
    const response = await api.get(`/api/v1/users/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Updates a user's status and role (active and staff) by sending a PUT request
// @param id - The unique identifier of the user to be updated
// @param is_active - A boolean indicating whether the user account is activated
// @param is_staff - A boolean indicating whether the user is a staff member
// @returns The response from the API if the user is updated successfully
export const changeUser = async (id: number, is_active: boolean, is_staff: boolean) => {
  try {
    const response = await api.put(`/api/v1/users/${id}/`, {is_active, is_staff});
    return response;
  } catch (error) {
    throw error;
  }
}

// Fetches the whitelist of emails from the API
// @returns The response from the API containing the whitelist of emails
export const fetchWhitelist = async () => {
  try {
    const response = await api.get(`/api/v1/users/whitelist/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Adds a new email to the whitelist by sending a POST request
// @param email - The email address to be added to the whitelist
// @returns The response from the API if the email is added successfully
export const createWhitelistEmail = async (email: string) => {
  try {
    const response = await api.post(`/api/v1/users/whitelist/`, {email});
    return response;
  } catch (error) {
    throw error;
  }
};

// Deletes an email from the whitelist by its ID
// @param id - The unique identifier of the email to be deleted from the whitelist
// @returns The response from the API if the email is deleted successfully
export const deleteWhitelist = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/users/whitelist/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches the permissions of the current user from the API
// @returns The response from the API containing the user's permissions
export const fetchUserPermission = async () => {
  try {
    const response = await api.get(`/api/v1/users/permissions/`);
    return response;
  } catch (error) {
    throw error;
  }
};