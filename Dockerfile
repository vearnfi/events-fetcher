FROM node:18 as base

WORKDIR /app

COPY package*.json ./ tsconfig.json ./

RUN npm install

COPY . ./
# ^ Copy all files

EXPOSE 5000
# ^ Documentation purpose only

FROM base as production

RUN npm run build \
&& rm -rf node_modules \
&& npm install --production
