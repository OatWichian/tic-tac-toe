import * as Yup from "yup";
// utils
import { fData } from "@utils/format-number";

const MAX_FILE_SIZE = 10 * 1000 * 1000; // 2 Mb
const FILE_FORMATS = [".glb"];
export const defaultValues = {
  name: "",
  filePath: "",
  file: "",
  status: false,
  costume_type_uuid: "",
  type: "",
};

export const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("name is required")
    .min(6, "Mininum 6 characters")
    .max(255, "Maximum 255 characters"),
  filePath: Yup.string().required("file is required"),
  costume_type_uuid: Yup.string().required("costume_type is required"),
  costume_category_uuid: Yup.string().required("costume_category is required"),
  type: Yup.string().required("type is required"),
  status: Yup.boolean(),
  file: Yup.mixed(),
});
