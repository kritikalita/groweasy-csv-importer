FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# 🎯 Explicitly install tsx globally inside the Linux container so it is always available
RUN npm install -g tsx

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]