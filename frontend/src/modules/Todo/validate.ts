import * as Yup from "yup";

export const CreateTodoSchema = Yup.object().shape({
  title: Yup.string().required("Title is required!"),
  description: Yup.string().optional(),
  status: Yup.string().required("Status is required!"),
});
