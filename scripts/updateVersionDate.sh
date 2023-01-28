#!/bin/bash

set -e
VERSION_FILE=src/app/version.ts
DATE=`date`
RELEASED="  released: \'${DATE}\'"

echo "released: ${RELEASED}"
sed -i "s/  released:.*/${RELEASED}/" ${VERSION_FILE}
