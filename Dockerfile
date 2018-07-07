#FROM apobbati/alpine-kubernetes-node:latest
FROM mhart/alpine-node:8.1.2
LABEL Name=bruce.xiao-firstReact Version=1.1.0 
COPY . /tmp
RUN cd /tmp \
    && npm install \
    && yarn run build \
    && cd build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY /tmp/build/. /usr/src/app
RUN npm install -g serve
EXPOSE 80
CMD serve -l 80

