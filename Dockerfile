FROM node:16.17.1 As development

WORKDIR /usr/src/nest-app-auth-role

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16.17.1 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/nest-app-auth-role

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/nest-app-auth-role/dist ./dist

CMD ["node", "dist/main"]