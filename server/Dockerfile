FROM node:8.15.0

RUN mkdir -p /user/src/code-school/server

WORKDIR /usr/src/code-school/server

COPY package*.json ./

RUN npm install

COPY . ./

# CMD ["npm", "run", "start"]