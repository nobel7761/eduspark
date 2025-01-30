import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import Select from "react-select";

// Add these subject options
const subjectOptions = [
  { value: "ict", label: "ICT" },
  { value: "english", label: "English" },
  { value: "bangla", label: "Bangla" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "mathematics", label: "Mathematics" },
  { value: "accounting", label: "Accounting" },
  { value: "economics", label: "Economics" },
  { value: "business_studies", label: "Business Studies" },
  { value: "history", label: "History" },
  { value: "civics", label: "Civics" },
  { value: "geography", label: "Geography" },
];

const EducationStep = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext();

  const selectedClass = watch("class");
  const showGroups = ["9", "10", "11", "12"].includes(selectedClass);
  const showSubjects = ["11", "12"].includes(selectedClass);

  // Handle subject selection
  const handleSubjectChange = (selectedOptions: any) => {
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
      className="p-4 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-3">Education & Address</h2>

      <div className="w-full flex gap-x-8 mb-4">
        {/* Institute Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.instituteName.message as string}
            </p>
          )}
        </motion.div>

        {/* Class */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-full"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.class.message as string}
            </p>
          )}
        </motion.div>
      </div>

      {/* Groups - Conditional Rendering */}
      {showGroups && (
        <div className="w-full flex mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full"
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
              <p className="text-red-500 text-sm mt-1">
                {errors.group.message as string}
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Subjects - Conditional Rendering */}
      {showSubjects && (
        <div className="w-full flex mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full"
          >
            <label className="block text-sm font-medium mb-1">Subjects</label>
            <Select
              isMulti
              options={subjectOptions}
              onChange={handleSubjectChange}
              className="react-select-container bg-primary"
              classNamePrefix="react-select"
              value={watch("subjects")}
            />
            {errors.subjects && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subjects.message as string}
              </p>
            )}
          </motion.div>
        </div>
      )}

      <div className="w-full flex gap-x-6 gap-y-4">
        {/* Present Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="w-full"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.presentAddress.message as string}
            </p>
          )}
        </motion.div>

        {/* Permanent Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="w-full"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.permanentAddress.message as string}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EducationStep;
