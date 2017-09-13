#!/usr/bin/env bash

if [ ! -f ./server/package.json ] ; then
    git clone git@github.com:deskach/locmote-fsi.git -b gh-pages web
fi

cd ./server &&
\ npm install &&
\ npm run start
