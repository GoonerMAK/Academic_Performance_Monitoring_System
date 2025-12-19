-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "student_id" TEXT,
    "age" INTEGER,
    "email" TEXT NOT NULL,
    "gender" TEXT,
    "nationality" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,
    "grade" TEXT,
    "marks" DECIMAL(65,30),
    "percentage" DECIMAL(65,30),
    "status" TEXT,
    "remarks" TEXT,
    "exam_date" TIMESTAMP(3),
    "academic_year" INTEGER,
    "semester" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInstitute" (
    "student_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,

    CONSTRAINT "StudentInstitute_pkey" PRIMARY KEY ("student_id","institute_id")
);

-- CreateTable
CREATE TABLE "StudentCourse" (
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentCourse_pkey" PRIMARY KEY ("student_id","course_id")
);

-- CreateTable
CREATE TABLE "InstituteCourse" (
    "institute_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "InstituteCourse_pkey" PRIMARY KEY ("institute_id","course_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Result_student_id_course_id_institute_id_key" ON "Result"("student_id", "course_id", "institute_id");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentInstitute" ADD CONSTRAINT "StudentInstitute_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentInstitute" ADD CONSTRAINT "StudentInstitute_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteCourse" ADD CONSTRAINT "InstituteCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
