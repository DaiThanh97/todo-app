import LoginForm from "../../modules/Auth/components/LoginForm";
import { Holder, Logo, LogoContainer } from "./styledComponents";
import AppLogo from "./../../assets/images/logo.png";

const Login: React.FC = () => {
  return (
    <Holder>
      <LogoContainer>
        <Logo src={AppLogo} />
      </LogoContainer>
      <LoginForm />
    </Holder>
  );
};

export default Login;
