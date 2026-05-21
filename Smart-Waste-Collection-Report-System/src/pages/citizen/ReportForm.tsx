import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import PhotoUpload from "../../components/PhotoUpload";

type FormData = {
  title: string;
  description: string;
};

export default function ReportForm() {
  const { register, handleSubmit } = useForm<FormData>();
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  function onSubmit(data: FormData) {
    console.log("submit report", data, file);
    navigate("/citizen/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create Report</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Title" {...register("title", { required: true })} />
        <label className="block mb-3">
          <div className="mb-1 text-sm text-slate-700">Description</div>
          <textarea
            {...register("description", { required: true })}
            className="w-full min-h-[120px] p-3 border rounded-md"
          />
        </label>
        <PhotoUpload onFile={setFile} />
        <div className="mt-3">
          <button type="submit" className="btn">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
