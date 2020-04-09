FROM node:12

ADD . /code

RUN cd /code && npm i && npm run build
RUN mv /code/build /app

RUN npm -g install serve

WORKDIR /app
CMD [ "serve", "-s", "/app" ]
