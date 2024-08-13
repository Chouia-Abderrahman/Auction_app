# auction_front/Dockerfile

# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]

#EXPOSE 5173
