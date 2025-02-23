import * as yup from "yup";

export const personalInfoSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  dateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  admissionDate: yup
    .date()
    .required("Admission date is required")
    .max(new Date(), "Admission date cannot be in the future"),

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

  phoneNumber: yup.string().optional(),
});

export const educationAndAddressInfoSchema = yup.object({
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

export const parentsInfoSchema = yup.object({
  father: yup.object({
    name: yup
      .string()
      .optional()
      .min(2, "Father's name must be at least 2 characters")
      .max(50, "Father's name must not exceed 50 characters"),
    phone: yup
      .string()
      .optional()
      .matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),

  mother: yup.object({
    name: yup
      .string()
      .optional()
      .min(2, "Mother's name must be at least 2 characters")
      .max(50, "Mother's name must not exceed 50 characters"),
    phone: yup
      .string()
      .optional()
      .matches(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
  }),
});

export const referralAndPaymentInfoSchema = yup.object({
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
