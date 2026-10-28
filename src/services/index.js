import axios from "axios";

export const AXIOS = axios.create({
  baseURL: "https://api-tarefas-21s9.onrender.com"
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