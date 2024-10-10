import { gql } from "@apollo/client";

export const GET_TODO_LIST = gql`
  query Query($filter: TodoFilterInput, $skip: Int, $limit: Int) {
    todos(filter: $filter, skip: $skip, limit: $limit) {
      result {
        id
        title
        description
        status
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: ID!) {
    todo(id: $id) {
      id
      title
      description
      status
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      description
      status
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $input: CreateTodoInput!) {
    updateTodo(id: $id, input: $input)
  }
`;
