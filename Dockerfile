# Use Node.js 18 LTS version
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (to take advantage of Docker's cache)
COPY package*.json ./


# Install dependencies and rebuild sqlite3 for the container
RUN npm install && npm rebuild sqlite3 --build-from-source


# Copy the rest of the application code
COPY . .

# Expose the port that your application will run on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
