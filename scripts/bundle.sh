#!/bin/bash
set -e
GIT_VERSION=`git describe --tags $(git rev-list --tags --max-count=1)`
echo $GIT_VERSION
cd dist
zip -r ../build/bundle-${GIT_VERSION}.zip .
echo "Bundle created: build/bundle-${GIT_VERSION}.zip"
