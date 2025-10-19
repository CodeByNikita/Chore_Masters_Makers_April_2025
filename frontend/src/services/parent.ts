import { PrizePayload, TaskPayload, TokenResponse } from "../types/types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchParent = async (token: string) => {
  const response = await fetch(`${BACKEND_URL}/parent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.document;
};

export const postAddPrize = async (prizeData: PrizePayload) => {
  const token = localStorage.getItem("token");
  const { name, value, image } = prizeData;

  const response = await fetch(`${BACKEND_URL}/parent/prize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: name, value: value, imageURL: image }),
  });

  if (!response.ok) {
    throw new Error("Failed to add prize");
  }

  return response.json();
};

export const postAddTask = async (taskData: TaskPayload) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BACKEND_URL}/parent/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to add task");
  }

  return response.json();
};

export const putEditTask = async (taskData: TaskPayload) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BACKEND_URL}/parent/task`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to add task");
  }

  return response.json();
};

export const postAddParent = async (signUpData: {
  username: string;
  password: string;
  profilePic: string;
}) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpData),
  };

  let response = await fetch(`${BACKEND_URL}/signup`, requestOptions);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Something went wrong");
  }

  const tokenResponse = await fetch(`${BACKEND_URL}/token`, requestOptions);

  if (!tokenResponse.ok) {
    throw new Error("Authentication failed");
  }

  const data = (await tokenResponse.json()) as TokenResponse;
  localStorage.setItem("token", data.token);
};

export const deleteTask = async (taskId: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/parent/task`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId: taskId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
};

export const deletePrize = async (prizeId: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BACKEND_URL}/parent/prize`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prizeId: prizeId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete prize");
  }

  return response.json();
};
