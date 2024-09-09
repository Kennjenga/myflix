import { signup } from "@/app/actions/auth";
import { SignupForm } from "@/components/signupform";

const signup_page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-9/10">
      <SignupForm />
    </div>
  );
};

export default signup_page;
