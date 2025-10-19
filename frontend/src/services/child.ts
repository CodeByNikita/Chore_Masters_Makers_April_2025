const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import { ChildData } from "../types/types";

export const fetchChild = async (token: string) => {
  const response = await fetch(`${BACKEND_URL}/child`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.document;
};

export const putTaskCompleteChild = async (
  token: string,
  task_id: string,
  beforeBase64?: string | null,
  afterBase64?: string | null
) => {
  const body = {
    task_id: task_id,
    ...(beforeBase64 && { picBefore: beforeBase64 }),
    ...(afterBase64 && { picAfter: afterBase64 }),
  };

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(`${BACKEND_URL}/child`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to update like listing");
  }
};

export const postAddChild = async (childData: ChildData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/child`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(childData),
  });

  if (!response.ok) {
    throw new Error("Failed to add child");
  }

  return response.json();
};
