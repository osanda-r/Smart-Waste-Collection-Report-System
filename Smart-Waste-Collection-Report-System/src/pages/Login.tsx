import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  function onSubmit(data: FormData) {
    console.log("login", data);
    // stub: in a real app call API and set auth
    navigate("/citizen/dashboard");
  }

  return (
    <div style={{ maxWidth: 520, margin: "28px auto" }}>
      <h2>Citizen Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />
        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
