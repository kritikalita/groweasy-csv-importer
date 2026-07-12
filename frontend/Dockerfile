FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Next.js format for binding to all interfaces inside a container
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "5173"]