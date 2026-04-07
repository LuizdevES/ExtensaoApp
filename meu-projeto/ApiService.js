import axios from "axios";

const api = axios.create({
  baseURL: "https://prothoracic-xanthophyllous-lavenia.ngrok-free.dev",
  timeout: 5000,
});

export default api;
