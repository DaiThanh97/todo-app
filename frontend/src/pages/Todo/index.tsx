import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import {
  TodoContainer,
  Logo,
  LogoContainer,
  StyledDropdownItem,
  StyledDropdownItemLogout,
  StyledEmailUser,
} from "./styledComponents";
import AppLogo from "./../../assets/images/logo.png";
import { RootState } from "../../store/reducers";
import { ROUTES } from "../../routes";
import TodoList from "../../modules/Todo/pages/List";
import CreateTodoForm from "../../modules/Todo/pages/Create";

const TodoPage: React.FC = () => {
  const { email } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">
            <LogoContainer>
              <Logo src={AppLogo} />
              <h3>ToDo Application</h3>
            </LogoContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <NavDropdown
              title={<StyledEmailUser>{email}</StyledEmailUser>}
              id="basic-nav-dropdown"
            >
              <StyledDropdownItem href={ROUTES.CREATE}>
                Create Todo
              </StyledDropdownItem>
              <NavDropdown.Divider />
              <StyledDropdownItemLogout>
                <div onClick={onLogOut}>Logout</div>
              </StyledDropdownItemLogout>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <TodoContainer>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path={ROUTES.CREATE} element={<CreateTodoForm />} />
          <Route path={`${ROUTES.CREATE}/:id`} element={<CreateTodoForm />} />
        </Routes>
      </TodoContainer>
    </>
  );
};

export default TodoPage;
