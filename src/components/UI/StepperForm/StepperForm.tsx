"use client";

import { motion } from "framer-motion";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  educationAndAddressInfoSchema,
  parentsInfoSchema,
  personalInfoSchema,
  referralAndPaymentInfoSchema,
} from "./Form Schemas/CreateStudentFormSchema";
import { FormData, FormFields, StepperFormProps } from "@/types/stepperForm";

const StepperForm: React.FC<StepperFormProps> = ({
  steps,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Get validation schema based on current step
  const getValidationSchema = (
    step: number
  ): yup.ObjectSchema<Partial<FormData>> => {
    switch (step) {
      case 1:
        return personalInfoSchema as yup.ObjectSchema<Partial<FormData>>;
      case 2:
        return educationAndAddressInfoSchema as yup.ObjectSchema<
          Partial<FormData>
        >;
      case 3:
        return parentsInfoSchema as yup.ObjectSchema<Partial<FormData>>;
      case 4:
        return referralAndPaymentInfoSchema as yup.ObjectSchema<
          Partial<FormData>
        >;
      default:
        return yup.object().shape({}) as yup.ObjectSchema<Partial<FormData>>;
    }
  };
  const methods = useForm<FormData>({
    resolver: yupResolver(
      getValidationSchema(currentStep)
    ) as Resolver<FormData>,
    mode: "onChange",
  });

  const { trigger } = methods;

  const handleNext = async () => {
    let fieldsToValidate: FormFields[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "name",
        "dateOfBirth",
        "gender",
        "religion",
        "primaryPhone",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "instituteName",
        "class",
        "presentAddress",
        "permanentAddress",
      ];

      const selectedClass = methods.getValues("class");
      if (["9", "10", "11", "12"].includes(selectedClass)) {
        fieldsToValidate.push("group");
      }
      if (["11", "12"].includes(selectedClass)) {
        fieldsToValidate.push("subjects");

        // Get subjects value and validate
        const subjects = methods.getValues("subjects");
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
          methods.setError("subjects", {
            type: "manual",
            message: "At least one subject must be selected",
          });
          return;
        }
      }
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "father.name",
        "father.phone",
        "mother.name",
        "mother.phone",
      ];
    } else if (currentStep === 4) {
      fieldsToValidate = [
        "payment.admissionFee",
        "payment.formFee",
        "payment.monthlyFee",
        "payment.packageFee",
      ];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
    }
  };

  // Reset form validation when step changes
  useEffect(() => {
    methods.clearErrors();
    methods.reset(methods.getValues(), {
      keepValues: true,
    });
  }, [currentStep, methods]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className="flex items-center cursor-pointer">
                {/* circle with step number */}
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "border-green-600 text-white border-4"
                      : "text-gray-600 border border-gray-600"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(step.id)}
                >
                  {step.id}
                </motion.div>

                {/* border */}
                {index < steps.length - 1 && (
                  <motion.div
                    className={`h-1 mx-3 rounded ${
                      currentStep > step.id ? "bg-green-600" : "bg-gray-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: "15rem" }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>

              {/* Title below the step */}
              <motion.span
                key={`title-${step.id}`}
                className={`text-sm font-medium mt-2 ${
                  currentStep >= step.id ? "text-green-600" : "text-gray-500"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {step.title}
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg shadow-lg"
          >
            {steps[currentStep - 1].component}
          </motion.div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className={`px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 ${
                currentStep === 1 ? "invisible" : ""
              }`}
            >
              Previous
            </button>

            {currentStep === steps.length ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>
      </FormProvider>
    </div>
  );
};

export default StepperForm;
