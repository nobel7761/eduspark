export function generateBangladeshiStudentData() {
  // Common Bangladeshi first names
  const firstNames = [
    "Abrar",
    "Fahim",
    "Tanvir",
    "Sakib",
    "Mehedi",
    "Rahat",
    "Nabil",
    "Shahriar",
    "Rifat",
    "Nahid",
    "Sadia",
    "Fatima",
    "Marium",
    "Sumaiya",
    "Nusrat",
    "Tasnia",
    "Lamia",
    "Nabila",
    "Ishrat",
    "Jannatul",
  ];

  // Common Bangladeshi last names
  const lastNames = [
    "Rahman",
    "Islam",
    "Ahmed",
    "Hossain",
    "Khan",
    "Uddin",
    "Alam",
    "Chowdhury",
    "Siddique",
    "Miah",
    "Begum",
    "Khatun",
    "Akter",
    "Sultana",
  ];

  // Educational institutes
  const institutes = [
    "National Ideal College",
    "Dhaka City College",
    "Dhaka Commerce College",
    "BAF Shaheen College",
    "Adamjee Cantonment College",
    "Notre Dame College",
    "Milestone College",
    "Scholars School and College",
  ];

  // Areas in Dhaka
  const areas = [
    "Banasree",
    "Rampura",
    "Badda",
    "Khilgaon",
    "Bashundhara",
    "Mirpur",
    "Uttara",
    "Dhanmondi",
    "Mohammadpur",
    "Gulshan",
  ];

  // Villages and districts
  const villages = [
    "Laxmipur",
    "Chandpur",
    "Noakhali",
    "Feni",
    "Cumilla",
    "Brahmanbaria",
    "Sylhet",
    "Moulvibazar",
  ];
  const districts = [
    "Cumilla",
    "Chandpur",
    "Noakhali",
    "Feni",
    "Chittagong",
    "Sylhet",
    "Dhaka",
    "Barishal",
  ];
  const thanas = [
    "Chauddagram",
    "Debidwar",
    "Burichang",
    "Chandina",
    "Daudkandi",
    "Homna",
    "Laksam",
    "Muradnagar",
  ];

  // Occupations
  const occupations = [
    "Businessman",
    "Government Employee",
    "Teacher",
    "Doctor",
    "Engineer",
    "Bank Officer",
    "Army Officer",
    "Police Officer",
    "Retired Businessman",
    "Private Service Holder",
  ];

  // Modified class mapping for ID generation
  const classMapping: { [key: string | number]: string } = {
    3: "03",
    4: "04",
    5: "05",
    6: "06",
    7: "07",
    8: "08",
    9: "09",
    10: "10",
    11: "11",
    12: "12",
    drawing: "13",
    arabic: "14",
    spoken_english: "15",
  };

  const classes = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    "drawing",
    "arabic",
    "spoken_english",
  ];

  const students = [];
  let counter = 1;

  for (let i = 0; i < 597; i++) {
    const classValue = classes[Math.floor(Math.random() * classes.length)];
    const classCode = classMapping[classValue];

    // Generate student ID with new pattern
    const studentId = `25${classCode}${counter.toString().padStart(4, "0")}`;

    const gender = Math.random() > 0.5 ? "male" : "female";

    const student = {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      class: classValue,
      sex: gender,
      presentAddress: `House: ${Math.floor(
        Math.random() * 100
      )}, Road: ${Math.floor(Math.random() * 20)}, Block: ${String.fromCharCode(
        65 + Math.floor(Math.random() * 12)
      )}, ${areas[Math.floor(Math.random() * areas.length)]}, Dhaka-${
        Math.floor(Math.random() * 2000) + 1200
      }`,
      permanentAddress: `Village: ${
        villages[Math.floor(Math.random() * villages.length)]
      }, Post Office: ${
        villages[Math.floor(Math.random() * villages.length)]
      } Bazar, Thana: ${
        thanas[Math.floor(Math.random() * thanas.length)]
      }, District: ${
        districts[Math.floor(Math.random() * districts.length)]
      }, Division: Chittagong`,
      institute: institutes[Math.floor(Math.random() * institutes.length)],
      primaryPhone: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(
        Math.random() * 1000000000
      )
        .toString()
        .padStart(9, "0")}`,
      secondaryPhone: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(
        Math.random() * 1000000000
      )
        .toString()
        .padStart(9, "0")}`,
      fatherName: `${
        firstNames[Math.floor(Math.random() * firstNames.length)]
      } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      fatherOccupation:
        occupations[Math.floor(Math.random() * occupations.length)],
      fatherPhone: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(
        Math.random() * 1000000000
      )
        .toString()
        .padStart(9, "0")}`,
      motherName: `${
        firstNames[Math.floor(Math.random() * firstNames.length)]
      } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      motherOccupation: "House wife",
      motherPhone: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(
        Math.random() * 1000000000
      )
        .toString()
        .padStart(9, "0")}`,
      studentId: studentId,
      photo: `https://student-photos.example.com/${studentId}_${gender}.jpg`,
      referredBy: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`,
        phone: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(
          Math.random() * 1000000000
        )
          .toString()
          .padStart(9, "0")}`,
      },
    };

    students.push(student);
    counter++;
  }

  return students;
}
