# Stage 1: Build dependencies
FROM node:20-alpine AS dependencies

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client (if using Prisma ORM)
RUN npx prisma generate

# Stage 2: Build the production image
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the node_modules and application code from the dependencies stage
COPY --from=dependencies /app /app

# Tentukan environment variable (jika diperlukan)
ENV JWT_SECRET_KEY=dukcapilsmg123

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "start"]