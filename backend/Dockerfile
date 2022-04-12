FROM node:16-alpine

RUN mkdir /app
COPY package.json tsconfig.json src /app/
COPY src /app/src
WORKDIR /app


RUN npm install \
    && npm run build 

ENV NODE_ENV=production

EXPOSE 3001
CMD [ "npm", "run", "migrate-start" ]