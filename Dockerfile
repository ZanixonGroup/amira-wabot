# SET ECOSYSTEM
FROM node:20-alpine AS builder

# SET APP DIRECTORY
WORKDIR /home/amira

# INSTALL VM DEPS
RUN apk add --no-cache \
  ffmpeg \
  imagemagick \
  libwebp
  
# COPY NPM CONFIG
COPY package*.json ./

# INSTALL DEPS
RUN npm ci --only=production

# COPY APP
COPY . .

# PORT
EXPOSE 1732

# RUN SCRIPT
CMD ["node", "index.js"]