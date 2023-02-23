import axiosInstance from "./axios";

const url = "https://xtream-ie.com";

const userinfo = {
  username: "MYOWN1",
  password: "Meins321",
};

export const getCategories = () => {
  return axiosInstance.get(`${url}/player_api.php`, {
    params: {
      username: userinfo.username,
      password: userinfo.password,
      action: "get_vod_categories",
    },
  });
};

export const searchBySort = () => {
  return axiosInstance.get(`${url}/player_api.php`, {
    params: {
      username: userinfo.username,
      password: userinfo.password,
      action: "get_vod_streams",
    },
  });
};

export const getMovieUrl = (id, ext) => {
  const { username, password } = userinfo;
  return axiosInstance.get(`${url}/movie/${username}/${password}/${id}.${ext}`);
};
