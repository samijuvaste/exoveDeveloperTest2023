FROM node:20.9.0-slim
WORKDIR /app
COPY . .
RUN npm install -g npm@10.2.4
RUN npm ci
RUN npm run tsc

USER node
CMD npm run start
