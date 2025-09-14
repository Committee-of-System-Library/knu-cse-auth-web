FROM node:20-alpine3.18

RUN mkdir /knu-cse-auth-web
WORKDIR /knu-cse-auth-web
COPY . /knu-cse-auth-web
ENV PATH /knu-cse-auth-web/node_modules/.bin:$PATH

RUN npm install --silent

USER root
RUN npm install -g serve --save
RUN npm run build
CMD ["npm", "run", "deploy"]
