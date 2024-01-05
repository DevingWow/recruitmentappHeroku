#!/bin/bash

sed -i 's/PORT_PLACEHOLDER/'"$PORT"'/g' nginx.conf.template

cp nginx.conf.template /etc/nginx/nginx.conf

nginx -g 'daemon off;'