FROM node:alpine AS builder

RUN mkdir /build
COPY . /build
WORKDIR /build

RUN npm install \
    && npm run build


FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /build/build /app