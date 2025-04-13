import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "react-select";
import { MultiValue } from "react-select";

// Add these subject options
export const subjectOptions = [
  { value: "ict", label: "ICT" },
  { value: "english1", label: "English 1st Paper" },
  { value: "english2", label: "English 2nd Paper" },
  { value: "english", label: "English" },
  { value: "bangla1", label: "Bangla 1st Paper" },
  { value: "bangla2", label: "Bangla 2nd Paper" },
  { value: "bangla", label: "Bangla" },
  { value: "physics1", label: "Physics 1st Paper" },
  { value: "physics2", label: "Physics 2nd Paper" },
  { value: "physics", label: "Physics" },
  { value: "chemistry1", label: "Chemistry 1st Paper" },
  { value: "chemistry2", label: "Chemistry 2nd Paper" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology1", label: "Biology 1st Paper" },
  { value: "biology2", label: "Biology 2nd Paper" },
  { value: "biology", label: "Biology" },
  { value: "mathematics", label: "Mathematics" },
  { value: "accounting", label: "Accounting" },
  { value: "economics", label: "Economics" },
];

interface SubjectOption {
  value: string;
  label: string;
}

const EducationStep = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const selectedClass = watch("class");
  const showGroups = ["9", "10", "11", "12"].includes(selectedClass);
  const showSubjects = ["11", "12"].includes(selectedClass);

  // Handle subject selection
  const handleSubjectChange = (selectedOptions: MultiValue<SubjectOption>) => {
    setValue("subjects", selectedOptions, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-lg"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
        Education & Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
        {/* Institute Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-1">
            Institute Name
          </label>
          <input
            type="text"
            {...register("instituteName", {
              required: "Institute name is required",
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          />
          {errors.instituteName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.instituteName.message as string}
            </p>
          )}
        </motion.div>

        {/* Class */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            {...register("class", { required: "Class is required" })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          >
            <option value="">Select Class</option>
            {Array.from({ length: 10 }, (_, i) => i + 3).map((classNum) => (
              <option key={classNum} value={classNum.toString()}>
                Class {classNum}
              </option>
            ))}
            <option value="arabic">Arabic</option>
            <option value="drawing">Drawing</option>
            <option value="spoken_english">Spoken English</option>
          </select>
          {errors.class && (
            <p className="text-red-500 text-xs mt-1">
              {errors.class.message as string}
            </p>
          )}
        </motion.div>
      </div>

      {/* Groups - Conditional Rendering */}
      {showGroups && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-4"
        >
          <label className="block text-sm font-medium mb-1">Group</label>
          <select
            {...register("group", { required: "Group is required" })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
          >
            <option value="">Select Group</option>
            <option value="science">Science</option>
            <option value="business">Business Studies</option>
            <option value="humanities">Humanities</option>
          </select>
          {errors.group && (
            <p className="text-red-500 text-xs mt-1">
              {errors.group.message as string}
            </p>
          )}
        </motion.div>
      )}

      {/* Subjects - Conditional Rendering */}
      {showSubjects && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-4"
        >
          <label className="block text-sm font-medium mb-1">Subjects</label>
          <Select
            isMulti
            options={subjectOptions}
            onChange={handleSubjectChange}
            className="react-select-container"
            classNamePrefix="react-select"
            value={watch("subjects")}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                borderColor: "#374151",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                color: "white",
                "&:hover": {
                  backgroundColor: "#374151",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#374151",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                "&:hover": {
                  backgroundColor: "#4B5563",
                  color: "white",
                },
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />
          {errors.subjects && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subjects.message as string}
            </p>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Present Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <label className="block text-sm font-medium mb-1">
            Present Address
          </label>
          <textarea
            {...register("presentAddress", {
              required: "Present address is required",
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            rows={3}
          />
          {errors.presentAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.presentAddress.message as string}
            </p>
          )}
        </motion.div>

        {/* Permanent Address */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <label className="block text-sm font-medium mb-1">
            Permanent Address
          </label>
          <textarea
            {...register("permanentAddress", {
              required: "Permanent address is required",
            })}
            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
            rows={3}
          />
          {errors.permanentAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.permanentAddress.message as string}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EducationStep;
