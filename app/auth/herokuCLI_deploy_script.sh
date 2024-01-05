#!/bin/bash

#make sure you are logged in to heroku and heroku container registry before rnning this script.

APP_NAME="recruitmentpark-auth"
AUTH_IMAGE_NAME="hero-auth"

docker build -t $AUTH_IMAGE_NAME .

heroku container:push web -a $APP_NAME

heroku container:release web -a $APP_NAME