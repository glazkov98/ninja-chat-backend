#!/bin/bash
sleep 5

npm run migrate:up
node ./src/main.js
