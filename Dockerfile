FROM node:8

# Create app directory
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["yarn", "run", "start"]
