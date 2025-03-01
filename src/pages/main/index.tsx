/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { TbMoodNerd } from "react-icons/tb";
import { TextInput } from "../../components/input";
import { MainLayout } from "../../components/layout";
import { Link } from "../../components/link";
import { FieldNames } from "../../enums/field-name.enum";
import { validationSchema } from "./schema.yup";

export interface LinkFormData {
  [FieldNames.Link]: string;
  [FieldNames.Params]: {
    [FieldNames.Key]: string;
    [FieldNames.Value]: string;
  }[];
}

export function MainPage(): JSX.Element {
  const [mountedUrl, setMountedUrl] = useState<string>();

  async function handleSubmit(data: LinkFormData): Promise<void> {
    let link = data.link.trim();
    let temporarySchemeAdded = false;

    if (!/^[a-zA-Z]+:\/\//.test(link)) {
      link = `http://${link}`;
      temporarySchemeAdded = true;
    }

    let url;
    try {
      url = new URL(link);
    } catch (error) {
      console.error("Invalid URL:", link);
      return;
    }

    data.params.forEach((param: { key: string; value: string }) => {
      if (param.key && param.value) {
        url.searchParams.append(param.key, param.value);
      }
    });

    let finalUrl = url.toString();

    // Remover "http://" temporário se foi adicionado
    if (temporarySchemeAdded) {
      finalUrl = finalUrl.replace(/^http:\/\//, "");
    }

    setMountedUrl(finalUrl);
    scrollTo(0, 0);
  }

  return (
    <MainLayout>
      <Formik
        initialValues={{
          [FieldNames.Link]: "",
          [FieldNames.Params]: [
            {
              [FieldNames.Key]: "utm_source",
              [FieldNames.Value]: "",
            },
            {
              [FieldNames.Key]: "utm_medium",
              [FieldNames.Value]: "",
            },
            {
              [FieldNames.Key]: "utm_campaign",
              [FieldNames.Value]: "",
            },
            {
              [FieldNames.Key]: "utm_term",
              [FieldNames.Value]: "",
            },
          ],
        }}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({ values, handleChange, errors }: FormikProps<LinkFormData>) => (
          <div>
            <Form>
              <div className="grid gap-6 mb-6 pt-4 pb-8 border-b">
                <TextInput
                  label="Url base"
                  name={FieldNames.Link}
                  value={values[FieldNames.Link]}
                  error={errors[FieldNames.Link]}
                  onChange={handleChange(FieldNames.Link)}
                  type="text"
                  placeholder="https://trebla.com.br"
                />
              </div>

              {mountedUrl && (
                <Link
                  title={mountedUrl}
                  onNewClick={() => setMountedUrl(undefined)}
                />
              )}

              <FieldArray name={FieldNames.Params}>
                {({ remove, push }) => (
                  <div className="flex-column">
                    <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
                      {values.params.length > 0 &&
                        values.params.map((_, index) => {
                          const pErrors: any = errors?.params?.[index];

                          const fieldError =
                            pErrors?.[index]?.[FieldNames.Key] ??
                            pErrors?.[index]?.[FieldNames.Value];

                          return (
                            <div className="border rounded p-4 ">
                              <div
                                className="flex w-full md:gap-4 gap-2 items-center"
                                key={index}
                              >
                                <div className="w-full">
                                  <TextInput
                                    label="Key"
                                    name={`params.${index}.key`}
                                    value={values.params[index].key}
                                    onChange={handleChange(
                                      `params.${index}.key`
                                    )}
                                    type="text"
                                    placeholder="utm_source"
                                  />
                                </div>

                                <div className="w-full">
                                  <TextInput
                                    label="Value"
                                    name={`params.${index}.value`}
                                    value={values.params[index].value}
                                    onChange={handleChange(
                                      `params.${index}.value`
                                    )}
                                    type="text"
                                    placeholder="google"
                                  />
                                </div>

                                <div>
                                  <label className="block mb-2 text-sm font-medium text-[#101827]">
                                    Remove
                                  </label>

                                  <button
                                    type="button"
                                    className="text-white border hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    onClick={() => remove(index)}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </div>

                              {fieldError && (
                                <span className="block mb-2 text-sm font-medium text-red-600 mt-2">
                                  {fieldError}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
                      onClick={() =>
                        push({
                          [FieldNames.Key]: "",
                          [FieldNames.Value]: "",
                        })
                      }
                    >
                      Add more
                    </button>
                  </div>
                )}
              </FieldArray>

              <button
                type="submit"
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-16 border"
              >
                Do it
              </button>
            </Form>

            {Object.entries(errors).length > 0 && (
              <div className="mt-24">
                <span className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <TbMoodNerd />
                  Nerds playground
                </span>

                <pre className="text-white bg-gray-800 p-4 rounded-md">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Formik>
    </MainLayout>
  );
}
