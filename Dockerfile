# Menggunakan image Node.js resmi
FROM node:18

# Menentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstall dependencies
RUN npm install

# Menyalin sisa kode aplikasi ke dalam container
COPY . .

# Menyediakan port yang akan digunakan aplikasi
EXPOSE 3000

# Menjalankan aplikasi
CMD ["npm", "start"]