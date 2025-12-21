# Academic_Performance_Monitoring_System
This system will include students, institutions, the courses they studied, and the results for each course. It will help monitor the performance of individual students as well as institutions, and may assist in identifying suitable candidates for specific tasks or job roles.


Commands in order:


1. docker compose up -d  (rename .env.example to .env and set the values accordingly)

2. cd server
3. npm install

4. npx prisma migrate deploy
5. npx prisma generate

6. npm run seed (to populate the database)

7. npm run dev