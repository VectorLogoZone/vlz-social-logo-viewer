#!/bin/bash

export $(cat .env)

tsc && USERNAME=u PASSWORD=p node dist/server.js
