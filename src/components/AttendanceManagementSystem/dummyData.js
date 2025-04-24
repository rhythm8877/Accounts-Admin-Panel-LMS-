// Generate class and section data
const classNumbers = Array.from({ length: 12 }, (_, i) => `${i + 1}${getOrdinalSuffix(i + 1)}`);
const sections = ['A', 'B', 'C'];

// Generate dummy student names
const firstNames = [
  'Aditya', 'Aarav', 'Arjun', 'Aryan', 'Ananya', 'Aditi', 'Anika', 'Aarushi',
  'Bhavya', 'Divya', 'Diya', 'Dhruv', 'Dev', 'Gauri', 'Ishaan', 'Ishita',
  'Kabir', 'Kiara', 'Krish', 'Kavya', 'Lakshya', 'Meera', 'Manav', 'Neha',
  'Nisha', 'Nikhil', 'Om', 'Prisha', 'Parth', 'Priyansh', 'Riya', 'Rohan',
  'Reyansh', 'Sanya', 'Saanvi', 'Sarthak', 'Tanvi', 'Tanish', 'Vihaan', 'Vanya',
  'Yash', 'Zara'
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Malhotra', 'Joshi',
  'Chopra', 'Mehta', 'Shah', 'Khanna', 'Kapoor', 'Agarwal', 'Reddy', 'Nair',
  'Rao', 'Mishra', 'Bhat', 'Iyer', 'Chauhan', 'Patil', 'Desai', 'Sinha',
  'Bansal', 'Arora', 'Pillai', 'Das', 'Chatterjee', 'Yadav'
];

// Function to get ordinal suffix for class numbers
function getOrdinalSuffix(num) {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  return 'th';
}

// Function to generate random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date within the current academic year
function getRandomDate() {
  const currentYear = new Date().getFullYear();
  const academicYearStart = new Date(currentYear, 3, 1); // April 1st
  const academicYearEnd = new Date(currentYear + 1, 2, 31); // March 31st
  
  if (new Date() < academicYearStart) {
    // If current date is before April 1st, use previous academic year
    academicYearStart.setFullYear(currentYear - 1);
    academicYearEnd.setFullYear(currentYear);
  }
  
  const randomTimestamp = academicYearStart.getTime() + Math.random() * (academicYearEnd.getTime() - academicYearStart.getTime());
  const randomDate = new Date(randomTimestamp);
  
  return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Generate students (20-40 students per section)
let studentId = 1;
const students = [];

classNumbers.forEach(classNumber => {
  sections.forEach(section => {
    const numberOfStudents = getRandomInt(20, 40);
    
    for (let rollNumber = 1; rollNumber <= numberOfStudents; rollNumber++) {
      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      
      students.push({
        id: studentId++,
        name: `${firstName} ${lastName}`,
        rollNumber,
        class: classNumber,
        section
      });
    }
  });
});

// Generate attendance records for the past 60 days
const attendanceRecords = [];
const today = new Date();
const pastDates = [];

// Generate past 60 days
for (let i = 0; i < 60; i++) {
  const date = new Date();
  date.setDate(today.getDate() - i);
  
  // Skip weekends
  if (date.getDay() !== 0 && date.getDay() !== 6) {
    pastDates.push(date.toISOString().split('T')[0]);
  }
}

// Generate attendance for each student on each date
students.forEach(student => {
  pastDates.forEach(date => {
    // 90% chance of being present
    const isPresent = Math.random() < 0.9;
    
    attendanceRecords.push({
      date,
      studentId: student.id,
      status: isPresent ? 'present' : 'absent'
    });
  });
});

// Generate holidays (about 1 per month)
const holidays = [
  { date: '2023-08-15', name: 'Independence Day' },
  { date: '2023-09-02', name: 'Teacher\'s Day' },
  { date: '2023-10-02', name: 'Gandhi Jayanti' },
  { date: '2023-10-24', name: 'Dussehra' },
  { date: '2023-11-12', name: 'Diwali' },
  { date: '2023-12-25', name: 'Christmas' },
  { date: '2024-01-26', name: 'Republic Day' },
  { date: '2024-03-08', name: 'Holi' }
];

// Export all dummy data
export {
  attendanceRecords, classNumbers, holidays, sections,
  students
};
