FROM node:19 as base
WORKDIR /src
COPY package*.json ./
EXPOSE ${PORT}

FROM base as production
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY . ./
CMD ["npm", "start"]

FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . ./
CMD ["npm", "run", "dev"]
