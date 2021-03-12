#!/bin/bash
rm -rf layer
mkdir -p layer/nodejs
cp ./packag*.json ./layer/nodejs/
cd ./layer/nodejs/
pwd
sed -i '/"postinstall"/d' ./package.json
npm ci --only=prod --unsafe-perm
cd - 
pwd
