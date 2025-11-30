import * as authRepository from "../repositories/authRepository.js";

export async function register(username, password) {
  const result = await authRepository.register(username, password);
  return result;
}

export async function login(username, password) {
  const result = await authRepository.login(username, password);
  return result;
}
