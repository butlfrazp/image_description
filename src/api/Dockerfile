FROM node:18-alpine

ARG PORT=3001

ENV NODE_ENV production
ENV PORT $PORT
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE $PORT

CMD ["npm", "start"]
