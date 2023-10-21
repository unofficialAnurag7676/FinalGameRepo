FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 4000
CMD [ "node", "app.js" ]





