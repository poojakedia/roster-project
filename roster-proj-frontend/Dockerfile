FROM node:latest AS builder

WORKDIR /app

COPY ./roster-proj/package.json ./roster-proj/package-lock.json ./

RUN npm install

COPY ./roster-proj .

RUN npm run build

FROM nginx:1.25.2-alpine-slim

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]