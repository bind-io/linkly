/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldArray, Form, Formik, FormikProps } from "formik";
import { useState, useEffect, useRef } from "react";
import {
  FaMagic,
  FaPlus,
  FaTrashAlt,
  FaHistory,
  FaInfoCircle,
} from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { TextInput } from "../../components/input";
import { MainLayout } from "../../components/layout";
import { Link } from "../../components/link";
import { InlineDebug } from "../../components/inline-debug";
import { FieldNames } from "../../enums/field-name.enum";
import { validationSchema } from "./schema.yup";
import { linkStorage, errorStorage } from "../../services/storage";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export interface LinkFormData {
  [FieldNames.Link]: string;
  [FieldNames.Params]: {
    [FieldNames.Key]: string;
    [FieldNames.Value]: string;
  }[];
}

export function MainPage(): JSX.Element {
  const { t } = useTranslation();
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
        toast.error(t("toast.invalidUrl"));
        return;
      }

      data.params.forEach((param: { key: string; value: string }) => {
        if (param.key && param.value) {
          url.searchParams.append(param.key, param.value);
        }
      });

      let finalUrl = url.toString();

      if (temporarySchemeAdded) {
        finalUrl = finalUrl.replace(/^http:\/\//, "");
      }

      linkStorage.save(data, finalUrl);
      setMountedUrl(finalUrl);
      setHasStoredLink(true);

      toast.success(t("toast.linkCreated"), {
        duration: 3000,
        icon: "✨",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      errorStorage.add(
        "Error generating link",
        error?.message || String(error)
      );
      toast.error(t("toast.error"));
    }
  }

  const handleRestoreLink = () => {
    const stored = linkStorage.get();
    if (!stored) {
      toast.error(t("toast.noPreviousLink"));
      return;
    }

    if (formikRef.current) {
      formikRef.current.setValues({
        link: stored.link,
        params: stored.params,
      });

      toast.success(t("toast.linkRestored"), { icon: "♻️" });
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
          <div className="max-w-3xl mx-auto">
            {/* Hero text - Simples e direto */}
            {!mountedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl sm:text-4xl font-black gradient-text mb-3">
                  {t("main.title")}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {t("main.subtitle")}
                </p>
              </motion.div>
            )}

            {/* Link gerado */}
            <AnimatePresence mode="wait">
              {mountedUrl && (
                <Link title={mountedUrl} onNewClick={handleNewLink} />
              )}
            </AnimatePresence>

            {/* Restore link button */}
            {hasStoredLink && !mountedUrl && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleRestoreLink}
                className="w-full mb-6 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-primary">
                    <FaHistory className="text-lg" />
                    <span className="font-semibold">
                      {t("main.restoreLink.title")}
                    </span>
                  </div>
                  {storedLinkUrl && (
                    <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-md max-w-full truncate">
                      {storedLinkUrl}
                    </span>
                  )}
                </div>
              </motion.button>
            )}

            {/* Form principal */}
            <Form className="space-y-6">
              {/* URL Base - Destaque */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <HiLightningBolt className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      {t("main.urlSection.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("main.urlSection.description")}
                    </p>
                  </div>
                </div>

                <TextInput
                  name={FieldNames.Link}
                  value={values[FieldNames.Link]}
                  error={errors[FieldNames.Link]}
                  onChange={handleChange(FieldNames.Link)}
                  type="text"
                  placeholder={t("main.urlSection.placeholder")}
                />

                {/* Quick tip */}
                <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                  <span>{t("main.urlSection.tip")}</span>
                </div>
              </motion.div>

              {/* Parameters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {t("main.paramsSection.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("main.paramsSection.description")}
                    </p>
                  </div>
                </div>

                <FieldArray name={FieldNames.Params}>
                  {({ remove, push }) => (
                    <div className="space-y-3">
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="group relative bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl p-4 transition-all"
                              >
                                <div className="flex gap-3">
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <TextInput
                                      label={index === 0 ? "Key" : undefined}
                                      name={`params.${index}.key`}
                                      value={values.params[index].key}
                                      onChange={handleChange(
                                        `params.${index}.key`
                                      )}
                                      type="text"
                                      placeholder={t(
                                        "main.paramsSection.keyPlaceholder"
                                      )}
                                    />
                                    <TextInput
                                      label={index === 0 ? "Value" : undefined}
                                      name={`params.${index}.value`}
                                      value={values.params[index].value}
                                      onChange={handleChange(
                                        `params.${index}.value`
                                      )}
                                      type="text"
                                      placeholder={t(
                                        "main.paramsSection.valuePlaceholder"
                                      )}
                                    />
                                  </div>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    className={`btn-danger self-center ${
                                      index === 0 ? "sm:mt-7" : ""
                                    }`}
                                    onClick={() => remove(index)}
                                    title="Remove"
                                  >
                                    <FaTrashAlt className="w-4 h-4" />
                                  </motion.button>
                                </div>

                                {fieldError && (
                                  <p className="text-xs text-destructive mt-2">
                                    {fieldError}
                                  </p>
                                )}
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>

                      {/* Add button */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        className="w-full py-4 border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                        onClick={() =>
                          push({
                            [FieldNames.Key]: "",
                            [FieldNames.Value]: "",
                          })
                        }
                      >
                        <FaPlus className="w-4 h-4" />
                        {t("main.paramsSection.addButton")}
                      </motion.button>
                    </div>
                  )}
                </FieldArray>

                {/* Common parameters hint */}
                {values.params.length === 0 && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">
                      {t("main.paramsSection.commonParams")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "utm_source",
                        "utm_medium",
                        "utm_campaign",
                        "utm_content",
                      ].map((param) => (
                        <button
                          key={param}
                          type="button"
                          onClick={() => {
                            if (formikRef.current) {
                              formikRef.current.setFieldValue("params", [
                                ...values.params,
                                { key: param, value: "" },
                              ]);
                            }
                          }}
                          className="text-xs px-3 py-1 bg-background hover:bg-primary/10 border border-border hover:border-primary/50 rounded-lg transition-all hover:text-primary font-medium"
                        >
                          {param}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Generate button - Proeminente */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary text-lg py-5 text-base font-bold shadow-2xl shadow-primary/30"
              >
                <FaMagic className="w-5 h-5" />
                {t("main.generateButton")}
              </motion.button>
            </Form>

            {/* Inline Debug - só aparece quando há erros */}
            <InlineDebug />
          </div>
        )}
      </Formik>
    </MainLayout>
  );
}
