FROM node:18
WORKDIR /usr/src/app
#AND package-lock.json are copied
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 4000
CMD [ "node", "server.js" ]
