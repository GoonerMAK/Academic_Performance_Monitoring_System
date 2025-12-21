import dotenv from "dotenv";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const firstNames = alphabet.map(letter => `FirstName ${letter}`);
const lastNames = alphabet.map(letter => `LastName ${letter}`);

const nationalities = alphabet.map(letter => `Nation ${letter}`);

const courseNames = alphabet.map(letter => `Course ${letter}`);

const instituteNames = alphabet.map(letter => `Institute ${letter}`);

const genders = ['Male', 'Female', 'Other'];
const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
const statuses = ['Pass', 'Fail', 'Pending', 'Incomplete'];
const semesters = ['Spring', 'Fall', 'Summer', 'Winter'];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  if (process.env.RUN_SEED !== "true") {
    console.log("RUN_SEED is false. Skipping seed.");
    return;
  }

  console.log('🌱  Starting seed...');

  console.log('🗑️  Clearing existing data...');
  await prisma.result.deleteMany();
  await prisma.studentCourse.deleteMany();
  await prisma.studentInstitute.deleteMany();
  await prisma.instituteCourse.deleteMany();
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();
  await prisma.institute.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating 1,000 users...');
  const users = [];
  for (let i = 0; i < 1000; i++) {
    users.push({
      email: `user${i}@example.com`,
      password: `$2b$10$hashedpassword${i}` 
    });
  }
  await prisma.user.createMany({ data: users });

  console.log('🏫 Creating 26 institutes...');
  const institutes = [];
  for (let i = 0; i < 26; i++) {
    institutes.push({
      name: instituteNames[i]
    });
  }
  const createdInstitutes = await prisma.$transaction(
    institutes.map(inst => prisma.institute.create({ data: inst }))
  );

  console.log('📚 Creating 26 courses...');
  const courses = [];
  for (let i = 0; i < 26; i++) {
    courses.push({
      name: courseNames[i],
      description: `Description for ${courseNames[i]} course`
    });
  }
  const createdCourses = await prisma.$transaction(
    courses.map(course => prisma.course.create({ data: course }))
  );

  console.log('🔗 Creating institute-course relationships...');
  const instituteCourses = [];
  for (const institute of createdInstitutes) {
    const numCourses = randomInt(10, 20);
    const selectedCourses = [...createdCourses]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCourses);
    
    for (const course of selectedCourses) {
      instituteCourses.push({
        institute_id: institute.id,
        course_id: course.id
      });
    }
  }
  await prisma.instituteCourse.createMany({ data: instituteCourses });

  console.log('🎓 Creating 30,000 students in batches...');
  const batchSize = 1000;
  const totalStudents = 30000;
  const createdStudents = [];

  for (let i = 0; i < totalStudents; i += batchSize) {
    const students = [];
    const currentBatch = Math.min(batchSize, totalStudents - i);
    
    for (let j = 0; j < currentBatch; j++) {
      const idx = i + j;
      students.push({
        name: `${random(firstNames)} ${random(lastNames)}`,
        student_id: `STU${String(idx).padStart(6, '0')}`,
        age: randomInt(18, 35),
        email: `student${idx}@example.com`,
        gender: random(genders),
        nationality: random(nationalities)
      });
    }

    const batch = await prisma.$transaction(
      students.map(student => prisma.student.create({ data: student }))
    );
    createdStudents.push(...batch);
    console.log(`  ✓ Created ${i + currentBatch}/${totalStudents} students`);
  }

  console.log('🔗 Creating student-institute relationships...');
  const studentInstitutes = [];
  for (const student of createdStudents) {
    const numInstitutes = randomInt(1, 3);
    const selectedInstitutes = [...createdInstitutes]
      .sort(() => Math.random() - 0.5)
      .slice(0, numInstitutes);
    
    for (const institute of selectedInstitutes) {
      studentInstitutes.push({
        student_id: student.id,
        institute_id: institute.id
      });
    }
  }

  for (let i = 0; i < studentInstitutes.length; i += batchSize) {
    await prisma.studentInstitute.createMany({
      data: studentInstitutes.slice(i, i + batchSize)
    });
    console.log(`  ✓ Created ${Math.min(i + batchSize, studentInstitutes.length)}/${studentInstitutes.length} relationships`);
  }

  console.log('🔗 Creating student-course relationships...');
  const studentCourses = [];
  for (const student of createdStudents) {
    const numCourses = randomInt(3, 8);
    const selectedCourses = [...createdCourses]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCourses);
    
    for (const course of selectedCourses) {
      studentCourses.push({
        student_id: student.id,
        course_id: course.id,
        enrollment_date: randomDate(new Date('2020-01-01'), new Date('2024-01-01'))
      });
    }
  }

  for (let i = 0; i < studentCourses.length; i += batchSize) {
    await prisma.studentCourse.createMany({
      data: studentCourses.slice(i, i + batchSize)
    });
    console.log(`  ✓ Created ${Math.min(i + batchSize, studentCourses.length)}/${studentCourses.length} relationships`);
  }

  console.log('📊 Creating ~100,000 results in batches...');
  const resultsToCreate = [];
  
  for (const student of createdStudents) {
    const studentInstituteIds = studentInstitutes
      .filter(si => si.student_id === student.id)
      .map(si => si.institute_id);
    
    const studentCourseIds = studentCourses
      .filter(sc => sc.student_id === student.id)
      .map(sc => sc.course_id);

    const numResults = randomInt(3, 4);
    
    for (let i = 0; i < numResults; i++) {
      if (studentInstituteIds.length === 0 || studentCourseIds.length === 0) continue;
      
      const marks = randomDecimal(0, 100);
      const percentage = marks;
      const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : marks >= 50 ? 'C' : 'F';
      const status = marks >= 50 ? 'Pass' : 'Fail';

      resultsToCreate.push({
        student_id: student.id,
        course_id: random(studentCourseIds),
        institute_id: random(studentInstituteIds),
        grade,
        marks,
        percentage,
        status,
        remarks: status === 'Pass' ? 'Good performance' : 'Needs improvement',
        exam_date: randomDate(new Date('2020-01-01'), new Date('2024-12-31')),
        academic_year: randomInt(2020, 2024),
        semester: random(semesters)
      });
    }
  }

  for (let i = 0; i < resultsToCreate.length; i += batchSize) {
    await prisma.result.createMany({
      data: resultsToCreate.slice(i, i + batchSize),
      skipDuplicates: true
    });
    console.log(`  ✓ Created ${Math.min(i + batchSize, resultsToCreate.length)}/${resultsToCreate.length} results`);
  }

  const counts = await prisma.$transaction([
    prisma.user.count(),
    prisma.student.count(),
    prisma.course.count(),
    prisma.institute.count(),
    prisma.result.count(),
    prisma.studentCourse.count(),
    prisma.studentInstitute.count(),
    prisma.instituteCourse.count()
  ]);

  console.log('\n✅ Seeding completed!');
  console.log('📊 Final counts:');
  console.log(`  Users: ${counts[0]}`);
  console.log(`  Students: ${counts[1]}`);
  console.log(`  Courses: ${counts[2]}`);
  console.log(`  Institutes: ${counts[3]}`);
  console.log(`  Results: ${counts[4]}`);
  console.log(`  Student-Course relationships: ${counts[5]}`);
  console.log(`  Student-Institute relationships: ${counts[6]}`);
  console.log(`  Institute-Course relationships: ${counts[7]}`);
  console.log(`\n🎉 Total records: ${counts.reduce((a, b) => a + b, 0)}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });