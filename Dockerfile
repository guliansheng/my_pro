FROM alpine:latest

RUN mkdir -p /home/workspace/asset && \
    mkdir -p /home/workspace/asset/dist && \
    mkdir -p /home/workspace/asset/dist_bak

WORKDIR /home/workspace/asset

COPY ./dist ./dist_bak
COPY ./start.sh ./


ENTRYPOINT ["sh", "./start.sh"]
