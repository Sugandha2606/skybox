import axios from "axios";

const BASE_URL = "http://localhost:8080/api/files";

export const getAllFiles = () => {
  return axios.get(BASE_URL);
};

export const getFileMetadata = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadFile = (id) => {
  return axios.get(`${BASE_URL}/${id}/download`, {
    responseType: "blob",
  });
};

export const deleteFile = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
