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
    // stub: upload and create report
    navigate("/citizen/dashboard");
  }

  return (
    <div style={{ maxWidth: 700, margin: "24px auto" }}>
      <h2>Create Report</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Title" {...register("title", { required: true })} />
        <label style={{ display: "block", marginBottom: 12 }}>
          <div style={{ marginBottom: 6 }}>Description</div>
          <textarea
            {...register("description", { required: true })}
            style={{ width: "100%", minHeight: 120, padding: 8 }}
          />
        </label>
        <PhotoUpload onFile={setFile} />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Submit Report
        </button>
      </form>
    </div>
  );
}
