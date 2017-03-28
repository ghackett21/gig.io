#!/bin/bash

node server.js &

sleep 2

firefox "localhost:8081/login.html"


