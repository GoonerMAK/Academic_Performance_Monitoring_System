-- CreateIndex
CREATE INDEX "Result_institute_id_academic_year_percentage_idx" ON "Result"("institute_id", "academic_year", "percentage");

-- CreateIndex
CREATE INDEX "Result_academic_year_course_id_idx" ON "Result"("academic_year", "course_id");

-- CreateIndex
CREATE INDEX "Result_student_id_percentage_idx" ON "Result"("student_id", "percentage");
