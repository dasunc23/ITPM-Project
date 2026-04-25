import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
});

export const getSemesters = async () => {
  const { data } = await api.get('/semesters');
  return data;
};

export const getModules = async (year, semester) => {
  const { data } = await api.get('/modules', {
    params: { year, semester },
  });
  return data;
};

export const getGames = async ({ moduleName, moduleId }) => {
  const { data } = await api.get('/games', {
    params: {
      module: moduleName,
      moduleId,
    },
  });
  return data;
};

export const getGameAccessStatus = async (userId) => {
  const { data } = await api.get(`/users/${userId}/game-access`);
  return data.access;
};

export const recordGameAccessPlay = async (userId) => {
  const { data } = await api.post(`/users/${userId}/game-access/play`);
  return data.access;
};

export default api;
