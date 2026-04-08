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

export default api;
