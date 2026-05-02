# Stage 1: Build Angular application
FROM node:20-alpine AS builder

ARG GIT_SHA=unknown

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV GIT_SHA=${GIT_SHA}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist/demo/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
