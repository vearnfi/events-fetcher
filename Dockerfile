FROM node:18
# as base

WORKDIR /app

COPY package*.json ./
# ^ Copy package.json and package-lock.json

RUN npm install

COPY . ./
# ^ Copy all files

EXPOSE 5000

#FROM base as production

#ENV NODE_PATH=./dist

RUN npm run build

CMD ["node", "./dist/index.js"]
# ^ This will run once the container is deployed (runtime)
