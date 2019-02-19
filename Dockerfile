FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN adduser -D myuser

USER myuser

# Bundle app source
COPY . .

#EXPOSE 5000
CMD [ "npm", "start" ]


