import api from "./interceptor.api";

export const fetchUsers = async () => {
  try {
    const response = await api.get(`/api/v1/users/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changeUser = async (id: number, is_active: boolean, is_staff: boolean) => {
  try {
    const response = await api.put(`/api/v1/users/${id}/`, {is_active, is_staff});
    return response;
  } catch (error) {
    throw error;
  }
}

export const fetchWhitelist = async () => {
  try {
    const response = await api.get(`/api/v1/users/whitelist/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createWhitelistEmail = async (email: string) => {
  try {
    const response = await api.post(`/api/v1/users/whitelist/`, {email});
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteWhitelist = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/users/whitelist/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserPermission = async () => {
  try {
    const response = await api.get(`/api/v1/users/permissions/`);
    return response;
  } catch (error) {
    throw error;
  }
};