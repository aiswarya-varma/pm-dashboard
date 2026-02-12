export const getToken = () =>
  localStorage.getItem("accessToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
};