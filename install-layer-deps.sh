#!/bin/bash
rm -rf layer
mkdir -p layer/nodejs
cp ./packag*.json ./layer/nodejs/
cd ./layer/nodejs/
pwd
npm ci --only=prod --unsafe-perm
cd - 
pwd
