FROM node:alpine

ARG VITE_API_URL
ARG VITE_ENABLE_TRACKING

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_TRACKING=$VITE_ENABLE_TRACKING

WORKDIR /client

COPY ../../client/package*.json ./

RUN npm install

COPY ../../client .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]