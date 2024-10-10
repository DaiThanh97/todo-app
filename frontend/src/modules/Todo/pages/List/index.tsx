import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import BootstrapTable, { ColumnDescription } from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  FilterButtonHolder,
  StatusLabel,
  StyledBidButton,
} from "./styledComponents";
import { useTodoListQuery } from "../../hooks";
import { ITodoListVars, Todo, TodoStatus } from "../../types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../routes";

const CURRENT_PAGE = 1;
const DEFAULT_SIZE_PER_PAGE = 10;

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const [todoFilter, setTodoFilter] = useState<ITodoListVars>({
    filter: {},
  });
  const { data, refetch } = useTodoListQuery({
    pollInterval: 10000,
    variables: {
      filter: todoFilter.filter,
      limit: DEFAULT_SIZE_PER_PAGE,
      skip: (CURRENT_PAGE - 1) * DEFAULT_SIZE_PER_PAGE,
    },
    fetchPolicy: "no-cache",
  });

  const onFilterClick = useCallback(
    (status?: TodoStatus) => {
      setTodoFilter({
        filter: { status },
      });
      refetch({
        filter: {
          status,
        },
        limit: DEFAULT_SIZE_PER_PAGE,
        skip: 0,
      });
    },
    [refetch]
  );

  const onEditButtonClick = useCallback(
    (todo: Todo) => {
      navigate(`${ROUTES.CREATE}/${todo.id}`);
    },
    [navigate]
  );

  const columns: ColumnDescription[] = [
    {
      dataField: "title",
      text: "Title",
      style: {
        width: "300px",
      },
    },
    {
      dataField: "description",
      text: "Description",
      style: {
        width: "300px",
      },
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (status: string) => (
        <StatusLabel $status={status}>{status}</StatusLabel>
      ),
      style: {
        width: "200px",
      },
    },
    {
      dataField: "",
      text: "Action",
      formatter: (_, row: Todo) => {
        return (
          <StyledBidButton
            variant="secondary"
            className="mx-2"
            onClick={() => onEditButtonClick(row)}
          >
            EDIT
          </StyledBidButton>
        );
      },
    },
  ];

  return (
    <>
      <FilterButtonHolder>
        {Object.values(TodoStatus).map((status) => (
          <Button
            variant="secondary"
            onClick={() => onFilterClick(status as TodoStatus)}
          >
            {status}
          </Button>
        ))}
      </FilterButtonHolder>
      {data?.todos && (
        <BootstrapTable
          keyField="id"
          remote
          onTableChange={undefined}
          data={data.todos.result ?? []}
          columns={columns}
          pagination={paginationFactory({
            sizePerPage: DEFAULT_SIZE_PER_PAGE,
            onPageChange: (page) => {
              refetch({
                filter: todoFilter.filter,
                skip: (page - 1) * DEFAULT_SIZE_PER_PAGE,
              });
            },
            hideSizePerPage: true,
            totalSize: data.todos.totalCount,
          })}
        />
      )}
    </>
  );
};

export default TodoList;
