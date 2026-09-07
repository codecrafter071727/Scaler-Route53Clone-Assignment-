import { api } from "@/shared/api";

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

if (!API_PREFIX) {
  throw new Error("NEXT_PUBLIC_API_PREFIX is not set. Add it to client/.env.local");
}

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
};

export type SignInPayload = {
  identifier: string;
  password: string;
};

export async function signUp(payload: SignUpPayload) {
  const { data } = await api.post<{ message: string }>(
    `${API_PREFIX}/auth/signup`,
    payload,
  );
  return data;
}

export async function signIn(payload: SignInPayload) {
  const { data } = await api.post<{ message: string; user: User }>(
    `${API_PREFIX}/auth/signin`,
    payload,
  );
  return data;
}

export async function signOut() {
  const { data } = await api.post<{ message: string }>(`${API_PREFIX}/auth/signout`);
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>(`${API_PREFIX}/auth/me`);
  return data;
}
