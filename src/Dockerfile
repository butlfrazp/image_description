## BUILD STAGE

FROM node:alpine as build-app

WORKDIR /app
COPY ./app/package.json ./app/package-lock.json ./
RUN NODE_ENV=development npm install
COPY ./app ./
RUN npm run build

FROM node:18-alpine

ARG PORT=8000

ENV NODE_ENV production
ENV PORT $PORT
WORKDIR /api
COPY ./api/package.json ./api/package-lock.json ./
RUN npm install

COPY ./api ./
COPY --from=build-app /app/build ./src/build

EXPOSE $PORT

CMD ["npm", "start"]
