/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import { FaMagic, FaPlus, FaTrashAlt } from "react-icons/fa";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <div className="max-w-3xl mx-auto">
            {mountedUrl && (
              <Link
                title={mountedUrl}
                onNewClick={() => setMountedUrl(undefined)}
              />
            )}

            <Form className="card">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Base Configuration
                </h2>
                <TextInput
                  label="Destination URL"
                  name={FieldNames.Link}
                  value={values[FieldNames.Link]}
                  error={errors[FieldNames.Link]}
                  onChange={handleChange(FieldNames.Link)}
                  type="text"
                  placeholder="https://example.com"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary/70 rounded-full"></span>
                  UTM Parameters
                </h2>

                <FieldArray name={FieldNames.Params}>
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      {values.params.length > 0 &&
                        values.params.map((_, index) => {
                          const pErrors: any = errors?.params?.[index];

                          const fieldError =
                            pErrors?.[index]?.[FieldNames.Key] ??
                            pErrors?.[index]?.[FieldNames.Value];

                          return (
                            <div
                              key={index}
                              className="group relative bg-muted/30 border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="w-full md:w-1/3">
                                  <TextInput
                                    label={
                                      index === 0 ? "Parameter Key" : undefined
                                    }
                                    name={`params.${index}.key`}
                                    value={values.params[index].key}
                                    onChange={handleChange(
                                      `params.${index}.key`
                                    )}
                                    type="text"
                                    placeholder="utm_source"
                                  />
                                </div>

                                <div className="w-full md:w-2/3">
                                  <TextInput
                                    label={index === 0 ? "Value" : undefined}
                                    name={`params.${index}.value`}
                                    value={values.params[index].value}
                                    onChange={handleChange(
                                      `params.${index}.value`
                                    )}
                                    type="text"
                                    placeholder="google"
                                  />
                                </div>

                                <div
                                  className={`flex items-end ${
                                    index === 0 ? "mt-7" : ""
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="btn-danger opacity-50 group-hover:opacity-100"
                                    onClick={() => remove(index)}
                                    title="Remove parameter"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </div>

                              {fieldError && (
                                <span className="block text-xs font-medium text-destructive mt-2">
                                  {fieldError}
                                </span>
                              )}
                            </div>
                          );
                        })}

                      <button
                        type="button"
                        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        onClick={() =>
                          push({
                            [FieldNames.Key]: "",
                            [FieldNames.Value]: "",
                          })
                        }
                      >
                        <FaPlus /> Add Custom Parameter
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="pt-6 border-t border-border">
                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4"
                >
                  <FaMagic /> Generate Link
                </button>
              </div>
            </Form>

            {Object.entries(errors).length > 0 && (
              <div className="mt-12 animate-pulse">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <span className="flex items-center gap-2 mb-2 text-sm font-bold text-destructive">
                    <TbMoodNerd className="text-lg" />
                    Validation Errors
                  </span>
                  <pre className="text-xs text-destructive/80 overflow-auto">
                    {JSON.stringify(errors, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Formik>
    </MainLayout>
  );
}
