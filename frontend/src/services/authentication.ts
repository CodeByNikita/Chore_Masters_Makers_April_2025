import { TokenResponse } from "../types/types";
import { NavigateFunction } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const postToken = async (
  username: string,
  password: string,
  navigate: NavigateFunction
) => {
  const payload = {
    username: username,
    password: password,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(`${BACKEND_URL}/token`, requestOptions);
  if (response.status !== 200) {
    throw new Error("Invalid credentials");
  }
  const data = (await response.json()) as TokenResponse;
  localStorage.setItem("token", data.token);
  if (data.userType === "Parent") {
    navigate("/parent");
  }
  if (data.userType === "Child") {
    navigate("/child");
  }
};
