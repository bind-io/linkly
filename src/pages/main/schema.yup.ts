import * as Yup from "yup";
import { FieldNames } from "../../enums/field-name.enum";
import i18n from "../../i18n/config";

export const validationSchema = Yup.object().shape({
  [FieldNames.Link]: Yup.string().required(() =>
    i18n.t("main.urlSection.required")
  ),
  [FieldNames.Params]: Yup.array().of(
    Yup.object().shape({
      [FieldNames.Key]: Yup.string().required(() =>
        i18n.t("main.paramsSection.keyRequired")
      ),
      [FieldNames.Value]: Yup.string().required(() =>
        i18n.t("main.paramsSection.valueRequired")
      ),
    })
  ),
});
