#!/bin/bash 

#Run this program from repo root directory.

NETWORK_NAME='micro-network'

NGINX_IMAGE='app/gateway/'
MICROAUTH_IMAGE='app/auth/'

NGINX_TAG='nginx-server'
MICROAUTH_TAG='auth-micro'

NGINX_CONTAINER_NAME='nginx_server'
MICROAUTH_CONTAINER_NAME='auth_micro'

GATEWAY_CONTAINER_PORT='80'
HOST_MAPPING_PORT='8000'

docker rm -f $NGINX_CONTAINER_NAME
docker rm -f $MICROAUTH_CONTAINER_NAME

docker build -t $NGINX_TAG $NGINX_IMAGE
docker build -t $MICROAUTH_TAG $MICROAUTH_IMAGE

docker run -d --name $MICROAUTH_CONTAINER_NAME --net $NETWORK_NAME $MICROAUTH_TAG
docker run -d --name $NGINX_CONTAINER_NAME --net $NETWORK_NAME -p $HOST_MAPPING_PORT:$GATEWAY_CONTAINER_PORT $NGINX_TAG

docker ps
