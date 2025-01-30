import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";

interface StepperFormProps {
  steps: {
    id: number;
    title: string;
    component: React.ReactNode;
  }[];
  onSubmit: (data: any) => void;
}

const StepperForm: React.FC<StepperFormProps> = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm();
  const { trigger } = methods;

  const handleNext = async () => {
    // Get the fields to validate based on current step
    let fieldsToValidate: string[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "religion",
        "primaryPhone",
      ];
    }

    // Trigger validation for the current step's fields
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
    }
  };

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
