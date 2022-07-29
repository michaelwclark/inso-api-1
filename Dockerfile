# Use an official Node runtime as a parent image
FROM node:12.18.1

# Set the working directory to /app
WORKDIR '/src'

# Copy package.json to the working directory
COPY package.json .

# Install any needed packages specified in package.json
RUN npm i

# Copying the rest of the code to the working directory
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Build the application
RUN npm run build

# Run app when the container launches
CMD ["npm", "run", "start:prod"]