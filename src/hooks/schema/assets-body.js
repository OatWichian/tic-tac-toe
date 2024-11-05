import * as Yup from "yup";

export const defaultValues = {
  name: "",
  file: "",
  filePath: "",
  thumbnail: "",
  thumbnailPath: "",
  unityIOSFile: "",
  unityIOSFilePath: "",
  unityAndroidFile: "",
  unityAndroidFilePath: "",
  status: false,
};

export const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("name is required")
    .min(6, "Mininum 6 characters")
    .max(255, "Maximum 255 characters"),
  filePath: Yup.string().required("file is required"),
  file: Yup.mixed(),
  thumbnail: Yup.mixed(),
  thumbnailPath: Yup.string().required("thumbnail is required"),
  status: Yup.boolean(),
});
