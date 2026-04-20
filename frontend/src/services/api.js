import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-savings-planner.onrender.com/api",
});

export default API;