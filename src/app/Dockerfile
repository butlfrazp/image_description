## BUILD STAGE

FROM node:alpine as build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN NODE_ENV=development yarn install
COPY . .
RUN npm run build

## UP NGINX STAGE

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
