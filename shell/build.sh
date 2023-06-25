#!/bin/bash
rm -rf lib

tsc

mkdir -p lib/template
mkdir -p lib/shell

cp -r template/ lib/template/
cp shell/execute.sh lib/shell/execute.sh
