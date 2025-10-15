# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Create a lightweight production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env ./.env

# Expose the port the app runs on
EXPOSE 4001

# Command to run the application
CMD ["node", "dist/main"]
