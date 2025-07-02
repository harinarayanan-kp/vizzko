FROM node:22.17

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]