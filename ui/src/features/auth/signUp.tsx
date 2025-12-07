import { useEffect } from "react";
import { toast } from "sonner";
import { SignUpForm } from "./signUpForm";

export default function SignUp() {
  useEffect(() => {
    toast.info("Please fill in the form to create a new account.");
  }, []);

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-8">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
