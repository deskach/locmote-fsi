#!/usr/bin/env bash

if [ ! -f ./web/index.html ] ; then
    git clone git@github.com:deskach/locmote-fsi.git -b gh-pages web
fi

cd ./server && npm install && npm start
