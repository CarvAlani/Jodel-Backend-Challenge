FROM node:9-alpine
RUN apk add --no-cache bash

WORKDIR /api

RUN yarn install

EXPOSE 3000

ADD . /api
RUN chmod +x /api/wait-for-it.sh

ENTRYPOINT [ "/api/wait-for-it.sh", "mongo:27017", "--" ]

ENTRYPOINT [ "/api/wait-for-it.sh", "redis:6379", "--" ]

CMD ["yarn", "start"]