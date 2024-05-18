FROM node:20.11.1-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
COPY public ./public
RUN npm install
COPY . .

# Build the Next.js app  
RUN npm run build  

CMD ["npm", "start"]