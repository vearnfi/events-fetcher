FROM node:18 as base

WORKDIR /app

COPY package*.json ./
# ^ Copy package.json and package-lock.json

# ARG NODE_ENV

# RUN if [ "$NODE_ENV" = "development" ]; \
#       then npm install; \
#       else npm install --only=production && npm install typescript -g; \
#       fi
# ^ See https://stackoverflow.com/questions/67048982/compile-typescript-code-in-dockerfile-does-not-work-cannot-find-name-process

RUN npm install && npm install typescript -g

COPY . ./
# ^ Copy all files

EXPOSE 5000
# ^ Documentation purpose only

FROM base as production

#ENV NODE_PATH=./dist

# RUN /usr/local/bin/tsc
RUN tsc

# CMD ["node", "./dist/index.js"]
# ^ This runs once the container is deployed (runtime)
# ^ Production config

# CMD ["npm", "run", "dev"]
# ^ Development config
