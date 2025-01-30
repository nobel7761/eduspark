import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface StepperFormProps {
  steps: {
    id: number;
    title: string;
    component: React.ReactNode;
  }[];
  onSubmit: (data: any) => void;
}

const personalInfoSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  dateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female"], "Please select a valid gender"),

  religion: yup
    .string()
    .required("Religion is required")
    .oneOf(
      ["Islam", "Hinduism", "Christianity", "Buddhism"],
      "Please select a valid religion"
    ),

  primaryPhone: yup
    .string()
    .required("Primary phone is required")
    .matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
});

const educationAndAddressInfoSchema = yup.object({
  instituteName: yup
    .string()
    .required("Institute name is required")
    .min(3, "Institute name must be at least 3 characters")
    .max(100, "Institute name must not exceed 100 characters"),

  class: yup
    .mixed()
    .required("Class is required")
    .oneOf(
      [
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "arabic",
        "drawing",
        "spoken_english",
      ],
      "Please select a valid class"
    ),

  group: yup.string().when("class", {
    is: (val: string) => ["9", "10", "11", "12"].includes(val),
    then: (schema) =>
      schema
        .required("Group is required")
        .oneOf(
          ["science", "business", "humanities"],
          "Please select a valid group"
        ),
    otherwise: (schema) => schema.nullable(),
  }),

  subjects: yup.array().when("class", {
    is: (classValue: string) => ["11", "12"].includes(classValue),
    then: (schema) =>
      schema
        .required("Subjects are required")
        .min(1, "At least one subject must be selected")
        .max(6, "Maximum 6 subjects can be selected")
        .test("is-valid-subjects", "Invalid subjects selection", (value) => {
          if (!value) return false;
          return Array.isArray(value) && value.length > 0;
        }),
    otherwise: (schema) => schema.nullable(),
  }),

  presentAddress: yup
    .string()
    .required("Present address is required")
    .min(3, "Present address must be at least 3 characters")
    .max(200, "Present address must not exceed 200 characters"),
});

const parentsInfoSchema = yup.object({
  father: yup.object({
    name: yup
      .string()
      .required("Father's name is required")
      .min(2, "Father's name must be at least 2 characters")
      .max(50, "Father's name must not exceed 50 characters"),
    phone: yup
      .string()
      .required("Father's phone is required")
      .matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),

  mother: yup.object({
    name: yup
      .string()
      .required("Mother's name is required")
      .min(2, "Mother's name must be at least 2 characters")
      .max(50, "Mother's name must not exceed 50 characters"),
    phone: yup
      .string()
      .required("Mother's phone is required")
      .matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),
});

const referralAndPaymentInfoSchema = yup.object({
  payment: yup.object({
    admissionFee: yup
      .number()
      .required("Admission fee is required")
      .min(0, "Admission fee cannot be negative")
      .typeError("Admission fee must be a number"),

    formFee: yup
      .number()
      .required("Form fee is required")
      .min(0, "Form fee cannot be negative")
      .typeError("Form fee must be a number"),

    monthlyFee: yup
      .number()
      .required("Monthly fee is required")
      .min(0, "Monthly fee cannot be negative")
      .typeError("Monthly fee must be a number"),

    packageFee: yup
      .number()
      .required("Package fee is required")
      .min(0, "Package fee cannot be negative")
      .typeError("Package fee must be a number"),
  }),
});

const StepperForm: React.FC<StepperFormProps> = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Get validation schema based on current step
  const getValidationSchema = (step: number) => {
    switch (step) {
      case 1:
        return personalInfoSchema;
      case 2:
        return educationAndAddressInfoSchema;
      case 3:
        return parentsInfoSchema;
      case 4:
        return referralAndPaymentInfoSchema;
      default:
        return yup.object().shape({});
    }
  };

  const methods = useForm({
    resolver: yupResolver(getValidationSchema(currentStep)),
    mode: "onChange",
  });

  const {
    trigger,
    formState: { errors },
  } = methods;

  const handleNext = async () => {
    let fieldsToValidate: string[] = [];

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
      resolver: yupResolver(getValidationSchema(currentStep)),
    });
  }, [currentStep, methods]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center cursor-pointer">
              {/* circle with step number */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center  ${
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
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <motion.span
              key={step.id}
              className={`text-sm font-medium ${
                currentStep >= step.id ? "text-green-600" : "text-gray-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {step.title}
            </motion.span>
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

          <div className="flex justify-between mt-8">
            <motion.button
              type="button"
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary border-2 border-primary hover:bg-white/80"
              }`}
              whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </motion.button>

            <motion.button
              type={currentStep === steps.length ? "submit" : "button"}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentStep < steps.length) {
                  handleNext();
                }
              }}
            >
              {currentStep === steps.length ? "Submit" : "Next"}
            </motion.button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default StepperForm;
