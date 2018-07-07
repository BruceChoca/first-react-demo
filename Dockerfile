#FROM apobbati/alpine-kubernetes-node:latest
FROM mhart/alpine-node:8.1.2
LABEL Name=bruce.xiao-firstReact Version=1.1.0 
COPY . /tmp
RUN cd /tmp \
    && npm install
RUN yarn run build
RUN mkdir -p /usr/src/app && mv /tmp/build/* /usr/src/app
RUN rm -rf /tmp
WORKDIR /usr/src/app
RUN npm install -g serve
EXPOSE 80
CMD serve -l 80

