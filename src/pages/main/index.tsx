/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { useState, useEffect, useRef } from "react";
import { FaMagic, FaPlus, FaTrashAlt, FaHistory, FaStar } from "react-icons/fa";
import { TextInput } from "../../components/input";
import { MainLayout } from "../../components/layout";
import { Link } from "../../components/link";
import { FieldNames } from "../../enums/field-name.enum";
import { validationSchema } from "./schema.yup";
import { linkStorage, errorStorage } from "../../services/storage";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export interface LinkFormData {
  [FieldNames.Link]: string;
  [FieldNames.Params]: {
    [FieldNames.Key]: string;
    [FieldNames.Value]: string;
  }[];
}

export function MainPage(): JSX.Element {
  const [mountedUrl, setMountedUrl] = useState<string>();
  const [hasStoredLink, setHasStoredLink] = useState(false);
  const [storedLinkUrl, setStoredLinkUrl] = useState<string>();
  const formikRef = useRef<FormikProps<LinkFormData>>(null);

  useEffect(() => {
    const stored = linkStorage.get();
    setHasStoredLink(!!stored);
    setStoredLinkUrl(stored?.url);
  }, [mountedUrl]);

  async function handleSubmit(data: LinkFormData): Promise<void> {
    try {
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
        errorStorage.add("Invalid URL format", link);
        toast.error("Invalid URL format. Please check your link.");
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

      // Save to localStorage
      linkStorage.save(data, finalUrl);

      setMountedUrl(finalUrl);
      setHasStoredLink(true);

      // Show success toast
      toast.success("Link generated successfully! 🎉", {
        duration: 5000,
        icon: "🔗",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      errorStorage.add(
        "Error generating link",
        error?.message || String(error)
      );
      toast.error("Failed to generate link. Check debug console for details.");
    }
  }

  const handleRestoreLink = () => {
    const stored = linkStorage.get();
    if (!stored) {
      toast.error("No saved link found");
      return;
    }

    if (formikRef.current) {
      formikRef.current.setValues({
        link: stored.link,
        params: stored.params,
      });

      toast.success("Link restored successfully!", {
        icon: "♻️",
      });

      // Scroll to form
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleNewLink = () => {
    setMountedUrl(undefined);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <MainLayout>
      <Formik
        innerRef={formikRef}
        initialValues={{
          [FieldNames.Link]: "",
          [FieldNames.Params]: [],
        }}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({ values, handleChange, errors }: FormikProps<LinkFormData>) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {mountedUrl && (
                <Link title={mountedUrl} onNewClick={handleNewLink} />
              )}
            </AnimatePresence>

            {hasStoredLink && !mountedUrl && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <button
                  type="button"
                  onClick={handleRestoreLink}
                  className="w-full bg-primary/10 hover:bg-primary/20 border-2 border-dashed border-primary/50 rounded-xl p-4 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 text-primary">
                      <FaHistory className="text-xl group-hover:rotate-[-20deg] transition-transform" />
                      <span className="font-medium">Restore Previous Link</span>
                      <FaStar className="text-sm" />
                    </div>
                    {storedLinkUrl && (
                      <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-md max-w-full truncate">
                        {storedLinkUrl}
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            )}

            <Form className="card">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
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
                  <span className="w-1 h-6 bg-gradient-to-b from-primary/70 to-primary/30 rounded-full"></span>
                  Custom Parameters
                </h2>

                <FieldArray name={FieldNames.Params}>
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {values.params.length > 0 &&
                          values.params.map((_, index) => {
                            const pErrors: any = errors?.params?.[index];

                            const fieldError =
                              pErrors?.[index]?.[FieldNames.Key] ??
                              pErrors?.[index]?.[FieldNames.Value];

                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="group relative bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all"
                              >
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                  <div className="w-full md:w-1/3">
                                    <TextInput
                                      label={
                                        index === 0
                                          ? "Parameter Key"
                                          : undefined
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
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      type="button"
                                      className="btn-danger opacity-50 group-hover:opacity-100"
                                      onClick={() => remove(index)}
                                      title="Remove parameter"
                                    >
                                      <FaTrashAlt />
                                    </motion.button>
                                  </div>
                                </div>

                                {fieldError && (
                                  <span className="block text-xs font-medium text-destructive mt-2">
                                    {fieldError}
                                  </span>
                                )}
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                        onClick={() =>
                          push({
                            [FieldNames.Key]: "",
                            [FieldNames.Value]: "",
                          })
                        }
                      >
                        <FaPlus className="group-hover:rotate-90 transition-transform" />{" "}
                        Add Custom Parameter
                      </motion.button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="pt-6 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full btn-primary text-lg py-4 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                >
                  <FaMagic /> Generate Link
                </motion.button>
              </div>
            </Form>
          </motion.div>
        )}
      </Formik>
    </MainLayout>
  );
}
