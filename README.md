# Academic_Performance_Monitoring_System
This system will include students, institutions, the courses they studied, and the results for each course. It will help monitor the performance of individual students as well as institutions, and may assist in identifying suitable candidates for specific tasks or job roles.


Commands in order:


1. docker compose up -d  (rename .env.example to .env and set the values accordingly)

2. cd server
3. npm install

4. npx prisma generate
5. npx prisma migrate deploy

6. npm run seed (to populate the database)

7. npm run dev


### Authentication Flow using JWT: 

1. Signup (password hashed) → Login → JWT issued → JWT stored in cookie

2. Client requests (protected route) → JWT verified (middleware) → Token stored in req.user (passes indentity forward)

3. User uses backend services as a authenticated user



### Example of a complex query: 

Module: Result

Query URL: GET /results?institute_id=550e8400-e29b-41d4-a716-446655440000&academic_year=2024&status=Pass&min_percentage=75&offset=0&limit=20