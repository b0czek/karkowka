FROM node:alpine AS builder

RUN mkdir /build
COPY . /build
WORKDIR /build

RUN npm install \
    && npm run build


FROM nginx:stable-alpine
COPY --from=builder /build/build /app