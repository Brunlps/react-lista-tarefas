import axios from "axios";

export const AXIOS = axios.create({
  baseURL: "http://localhost:3000"
});

export const getUsuarioSessao = () => {
  try {
    const usuario = sessionStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    sessionStorage.removeItem("usuario");
    return null;
  }
};

export const limparUsuarioSessao = () => {
  sessionStorage.removeItem("usuario");
};