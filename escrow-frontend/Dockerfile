# Base image for development
FROM node:lts AS build

# Set the working directory for the container
WORKDIR /usr/local/app

# Copy package.json and package-lock.json to the container
COPY ./ /usr/local/app/

RUN npm install --force

RUN npm install -g @angular/cli

# Install app dependencies
RUN npm run build --omit=dev

#Stage 2

FROM nginx:latest

# Copy the Nginx configuration file to the container
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/local/app/dist/escrow /usr/share/nginx/html

EXPOSE 80
