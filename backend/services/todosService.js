import * as todosRepository from "../repositories/todosRepository.js";

export async function getAllTodos(userId) {
  const todos = await todosRepository.getAllTodos(userId);
  return todos;
}

export async function getTodo(todoId, userId) {
  const todo = await todosRepository.getTodo(todoId, userId);
  return todo;
}

export async function createTodo(data, userId) {
  const title = data.title;
  const completed = data.completed;
  const todo = await todosRepository.createTodo(title, completed, userId);
  return todo;
}

export async function updateTodo(todoId, data, userId) {
  const title = data.title;
  const completed = data.completed;
  const todo = await todosRepository.updateTodo(
    todoId,
    title,
    completed,
    userId
  );
  return todo;
}

export async function deleteTodo(todoId, userId) {
  const todo = await todosRepository.deleteTodo(todoId, userId);
  return todo;
}
