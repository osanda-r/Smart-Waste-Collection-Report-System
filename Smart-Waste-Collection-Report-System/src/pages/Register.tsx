import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  function onSubmit(data: FormData) {
    console.log("register", data);
    // stub: call API to register
    navigate("/citizen/dashboard");
  }

  return (
    <div style={{ maxWidth: 520, margin: "28px auto" }}>
      <h2>Citizen Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Full name"
          type="text"
          {...register("name", { required: true })}
        />
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
          Register
        </button>
      </form>
    </div>
  );
}
