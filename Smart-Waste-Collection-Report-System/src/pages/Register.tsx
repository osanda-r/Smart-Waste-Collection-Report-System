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
    navigate("/citizen/dashboard");
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Citizen Register</h2>
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
        <div className="mt-3">
          <button type="submit" className="btn">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
