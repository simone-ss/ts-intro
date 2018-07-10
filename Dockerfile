#Dockerhub image
FROM node:8

# Define app dir on remote server
WORKDIR /app

# Bundle app source
COPY . .

RUN yarn install

# Port Exposed
EXPOSE 3000

CMD ["yarn", "run", "start"]
