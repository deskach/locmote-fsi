#!/usr/bin/env bash

git clone git@github.com:deskach/locmote-fsi.git -b gh-pages web &&
\ cd server &&
\ npm install &&
\ npm run start
