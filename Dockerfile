FROM node:18
# as base

WORKDIR /app

COPY package*.json ./
# ^ Copy package.json and package-lock.json

RUN npm install

COPY . ./
# ^ Copy all files

EXPOSE 5000
# ^ Documentation purpose only

#FROM base as production

#ENV NODE_PATH=./dist

RUN npm run build

# CMD ["node", "./dist/index.js"]
# ^ This runs once the container is deployed (runtime)
# ^ Production config

# CMD ["npm", "run", "dev"]
# ^ Development config
