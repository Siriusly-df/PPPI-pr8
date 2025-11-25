# PPPI-pr8

Цей проєкт демонструє:
- автентифікацію через JWT;
- авторизацію за ролями (RBAC);
- захищені маршрути;
- використання OAuth2 (Google OAuth Playground).

1. Клонувати репозиторій:
```bash
git clone https://github.com/Siriusly-df/PPPI-pr8.git
cd PPPI-pr8

2.Встановити залежності:
npm install

3.Створити .env на основі .env.example:
PORT=3000
JWT_SECRET=your_secret_here

4.Запустити сервер:
node src/server.js

1. Login — USER
```powershell
$U_TOKEN = (curl -Uri "http://localhost:3000/login" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"user@example.com","password":"user123"}' `
  | ConvertFrom-Json).access_token

echo $U_TOKEN

2. Login — ADMIN
$A_TOKEN = (curl -Uri "http://localhost:3000/login" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"admin@example.com","password":"admin123"}' `
  | ConvertFrom-Json).access_token

echo $A_TOKEN

3. GET /profile
Без токена → 401
curl -Uri "http://localhost:3000/profile" -Method Get

С токеном → 200
curl -Uri "http://localhost:3000/profile" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer $U_TOKEN" }

4.DELETE /users/:id — RBAC
USER → 403 Forbidden
curl -Uri "http://localhost:3000/users/5" `
  -Method Delete `
  -Headers @{ "Authorization" = "Bearer $U_TOKEN" }

ADMIN → 200 OK
curl -Uri "http://localhost:3000/users/5" `
  -Method Delete `
  -Headers @{ "Authorization" = "Bearer $A_TOKEN" }
