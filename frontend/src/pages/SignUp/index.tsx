import SignUpForm from "../../modules/Auth/components/SignUpForm";
import { Holder, Logo, LogoContainer } from "./styledComponents";
import AppLogo from "./../../assets/images/logo.png";

const SignUp: React.FC = () => {
  return (
    <Holder>
      <LogoContainer>
        <Logo src={AppLogo} />
      </LogoContainer>
      <SignUpForm />
    </Holder>
  );
};

export default SignUp;
