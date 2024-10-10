import { QueryHookOptions, useMutation, useQuery } from "@apollo/client";
import { CREATE_TODO, GET_TODO, GET_TODO_LIST, UPDATE_TODO } from "./graphql";
import {
  ICreateTodoResult,
  ICreateTodoVars,
  ITodoListQueryResponse,
  ITodoQueryResponse,
  IUpdateTodoResult,
  IUpdateTodoVars,
} from "./types";

export const useTodoListQuery = (
  options: QueryHookOptions<ITodoListQueryResponse>
) => useQuery<ITodoListQueryResponse>(GET_TODO_LIST, options);

export const useTodoQuery = (options: QueryHookOptions<ITodoQueryResponse>) =>
  useQuery<ITodoQueryResponse>(GET_TODO, options);

export const useCreateTodo = () =>
  useMutation<ICreateTodoResult, ICreateTodoVars>(CREATE_TODO);

export const useUpdateTodo = () =>
  useMutation<IUpdateTodoResult, IUpdateTodoVars>(UPDATE_TODO);
