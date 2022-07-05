FROM node:12.14.1 AS build
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY postcss.config.js postcss.config.js
COPY tailwind.config.js tailwind.config.js
COPY .env .env
COPY public/ public
COPY src/ src
RUN npm run build

# Stage 1, based on NGINX to provide a configuration to be used with react-routerFROM nginx:alpine
FROM nginx:alpine
COPY --from=build /build/build/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 8090
CMD ["nginx", "-g", "daemon off;"]