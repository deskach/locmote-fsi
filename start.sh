#!/usr/bin/env bash

if [ ! -f "./web/index.html" ] ; then
    echo "Cloning UI";
    git clone git@github.com:deskach/locmote-fsi.git -b gh-pages web
fi

if [ ! -d "./server/node_modules" ] ; then
    echo "Installing libraries...";
    cd ./server && npm install && cd -
fi

cd ./server/ && npm start
