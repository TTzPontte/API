#!/bin/bash
rm -rf layer
mkdir -p layer/nodejs
cp ../common/package* ./layer/nodejs/
cd ./layer/nodejs/
pwd
npm ci --only=prod --unsafe-perm
cd - 
pwd
