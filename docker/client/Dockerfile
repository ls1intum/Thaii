FROM node:alpine

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

WORKDIR /client

COPY ./client/package*.json ./

RUN npm install

COPY ./client .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]