#!/bin/sh

echo ""
echo "Building the app for Firefox Market Place"
echo ""

cd `dirname $0`
cd ..

zip -r ../xmas-markets.FFOS.zip *
