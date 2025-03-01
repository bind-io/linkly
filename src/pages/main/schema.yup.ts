import * as Yup from "yup";
import { FieldNames } from "../../enums/field-name.enum";

export const validationSchema = Yup.object().shape({
  [FieldNames.Link]: Yup.string().required("URL is required"),
  [FieldNames.Params]: Yup.array().of(
    Yup.object().shape({
      [FieldNames.Key]: Yup.string().required("Key is required"),
      [FieldNames.Value]: Yup.string().required("Value is required"),
    })
  ),
});
