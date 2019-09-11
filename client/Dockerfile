FROM node:8.15.0

RUN mkdir -p /usr/src/code-school/client

WORKDIR /usr/src/code-school/client

COPY package*.json ./

RUN npm install

COPY . ./

# CMD ["npm", "run", "build"]