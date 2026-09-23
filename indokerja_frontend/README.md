# Ignatius-Dillwyn-Full-Stack-Developer
Cara set up Service/Backend di Local:
1. cd '.\indokerja backend\'
2. npm install
3. Ke file config.json pada folder config dan sesuasikan username dan password database di "development" pada device masing-masing
4. npx sequelize-cli db:create
5. npx sequelize-cli db:migrate
6. Jalankan server di terminal dengan command 'npx nodemon app.js' (tanpa kutip)

Cara set up frontend di Local:
1. cd '.\indokerja frontend\'
2. npm install
3. Jalankan di terminal dengan command 'npm run dev' (tanpa kutip)