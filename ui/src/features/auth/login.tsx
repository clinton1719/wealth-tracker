import { toast } from "sonner";
import { LoginForm } from "./loginForm";

export default function Login({ isTokenExpired }: LoginProps) {
  if (isTokenExpired) {
    toast.warning("Your session has expired. Please log in again.");
  }

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-8">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

interface LoginProps {
  isTokenExpired?: boolean;
}
