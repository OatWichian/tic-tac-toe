import * as Yup from 'yup';

const MAX_FILE_SIZE = 10 * 1000 * 1000; // 2 Mb
const FILE_FORMATS = ['.glb'];
export const defaultValues = {
  name: '',
  color: '',
  filePath: '',
  file: '',
  unityIOSFile: '',
  unityIOSFilePath: '',
  unityAndroidFile: '',
  unityAndroidFilePath: '',
  status: false,
};

export const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required('name is required')
    .min(6, 'Mininum 6 characters')
    .max(255, 'Maximum 255 characters'),
  filePath: Yup.string().required('file is required'),
  status: Yup.boolean(),
  file: Yup.mixed(),
});
