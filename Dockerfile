#FROM apobbati/alpine-kubernetes-node:latest
FROM mhart/alpine-node:8.1.2
LABEL Name=bruce.xiao-firstReact Version=1.1.0 
COPY package.json /tmp/package.json
RUN cd /tmp \
    && npm install 

RUN mkdir -p /usr/src/app && mv /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn run build
RUN npm install -g serve
RUN rm -rf ./src
RUN rm -rf ./public
EXPOSE 80
CMD serve -s build --port 80

