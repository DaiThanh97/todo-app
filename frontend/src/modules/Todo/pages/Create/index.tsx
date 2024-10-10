import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { showErrorToast, showSuccessToast } from "../../../../libs/toast";
import { ROUTES } from "../../../../routes";
import { useCreateTodo, useTodoQuery, useUpdateTodo } from "../../hooks";
import { CreateTodoSchema } from "../../validate";
import { ICreateTodoInput, TodoStatus } from "../../types";
import { ButtonHolder, Title } from "./styledComponents";

const initialValues: ICreateTodoInput = {
  title: "",
  description: "",
  status: TodoStatus.READY,
};

const CreateTodoForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data } = useTodoQuery({
    variables: {
      id: params.id,
    },
  });

  const isUpdate = !!data?.todo;
  const [createTodo, { loading: loadingCreate }] = useCreateTodo();
  const [updateTodo, { loading: loadingUpdate }] = useUpdateTodo();
  const { values, errors, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    validationSchema: CreateTodoSchema,
    onSubmit: async (values: ICreateTodoInput) => {
      try {
        const result = isUpdate
          ? await updateTodo({
              variables: {
                id: params.id!,
                input: {
                  title: values.title,
                  description: values.description,
                  status: values.status,
                },
              },
            })
          : await createTodo({
              variables: {
                input: {
                  title: values.title,
                  description: values.description,
                  status: values.status,
                },
              },
            });

        const [error] = result.errors ?? [];
        if (error) {
          throw error;
        }

        const response = !!result.data;
        if (response) {
          showSuccessToast(`Create item successfully!`);
          navigate(ROUTES.HOME);
        }
      } catch (err: any) {
        console.log(err);
        showErrorToast(err.message);
      }
    },
  });

  useEffect(() => {
    if (isUpdate) {
      const { todo } = data ?? {};
      if (todo) {
        const { title, description, status } = todo;
        setValues({ title, description, status });
      }
    }
  }, [data, isUpdate, handleChange, setValues]);

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Create ToDo</Title>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          value={values.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          value={values.description}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Select
          aria-label="Status"
          defaultValue={TodoStatus.READY}
          name="status"
          value={values.status}
          onChange={handleChange}
        >
          {Object.values(TodoStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <ButtonHolder>
        <Button
          variant="secondary"
          className="w-100  mx-2"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loadingCreate || loadingUpdate}
          variant="primary"
          className="w-100"
        >
          {loadingCreate || loadingUpdate ? (
            <Spinner animation="border" variant="light" />
          ) : isUpdate ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </ButtonHolder>
    </Form>
  );
};

export default CreateTodoForm;
