# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 (or the port your backend is running on)
EXPOSE 5000

# Command to run the backend
CMD ["node", "app.js"]
