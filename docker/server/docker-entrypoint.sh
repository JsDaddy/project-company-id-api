#!/bin/bash

cd /var/www/company-id

if [ ! -d /var/www/company-id/node_modules ]; then
  npm cache clean -f  &&  npm install
fi;

npm run start:dev