import { ITeacher, PaymentType } from "@/types/teacher";

export function generateBangladeshiTeacherData() {
  // Reusing some data from student generator
  const firstNames = [
    "Mohammad",
    "Ahmed",
    "Rahman",
    "Islam",
    "Hossain",
    "Alam",
    "Uddin",
    "Karim",
    "Rashid",
    "Mahmud",
    "Sajid",
    "Rahim",
    "Miah",
    "Sheikh",
    "Siddique",
    "Haque",
    "Chowdhury",
    "Khan",
    "Begum",
    "Khatun",
  ];

  const lastNames = [
    "Rahman",
    "Ahmed",
    "Hossain",
    "Islam",
    "Alam",
    "Uddin",
    "Khan",
    "Chowdhury",
    "Siddique",
    "Miah",
    "Sheikh",
    "Haque",
    "Karim",
    "Rashid",
    "Mahmud",
    "Sajid",
    "Rahim",
    "Begum",
    "Khatun",
  ];

  const sscHscInstitutes = [
    "Dhaka College",
    "Notre Dame College",
    "Rajuk Uttara Model College",
    "Viqarunnisa Noon School and College",
    "Holy Cross College",
    "Adamjee Cantonment College",
    "Dhaka Residential Model College",
    "Government Laboratory High School",
    "St. Joseph Higher Secondary School",
    "BAF Shaheen College",
  ];

  const groups = ["Science", "Commerce", "Humanities"];

  const areas = [
    "Uttara",
    "Banani",
    "Gulshan",
    "Dhanmondi",
    "Mirpur",
    "Mohammadpur",
    "Bashundhara",
    "Badda",
    "Khilgaon",
    "Rampura",
  ];

  const teachers = [];

  for (let i = 0; i < 300; i++) {
    const teacherId = `TCH${(i + 1).toString().padStart(4, "0")}`;
    const graduationYear = 1990 + Math.floor(Math.random() * 20);

    const teacher: ITeacher = {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
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
      paymentType:
        Math.random() > 0.5 ? PaymentType.FIXED : PaymentType.CLASS_BASED,
      nidNumber: `19${graduationYear}${Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0")}`,
      photo: `https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg`,
      teacherId: teacherId,
      address: `House: ${Math.floor(Math.random() * 100)}, Road: ${Math.floor(
        Math.random() * 20
      )}, Block: ${String.fromCharCode(65 + Math.floor(Math.random() * 12))}, ${
        areas[Math.floor(Math.random() * areas.length)]
      }, Dhaka-${Math.floor(Math.random() * 9000 + 1000)}`,
      educationalBackground: {
        sscInstitute:
          sscHscInstitutes[Math.floor(Math.random() * sscHscInstitutes.length)],
        sscPassingYear: (graduationYear - 4).toString(),
        sscGroup: groups[Math.floor(Math.random() * groups.length)],
        hscInstitute:
          sscHscInstitutes[Math.floor(Math.random() * sscHscInstitutes.length)],
        hscPassingYear: (graduationYear - 2).toString(),
        hscGroup: groups[Math.floor(Math.random() * groups.length)],
      },
    };

    teachers.push(teacher);
  }

  return teachers;
}
