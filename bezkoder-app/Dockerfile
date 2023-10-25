FROM node:14

WORKDIR /bezkoder-app
COPY package.json .
RUN npm install
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install nodemon -g
COPY . .
CMD nodemon server.js
