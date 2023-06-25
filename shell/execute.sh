#!/bin/bash
git config alias.cc '!npx git-stage-validator'

npx git-stage-validator-core "$@" && git commit "$@"

# if [ "$SHELL" == "/usr/bin/powershell" ]; then
#     powershell -Command "if (npx git-stage-validator-core) { git commit $args }"
# else
#     echo "shell: $SHELL"
#     npx git-stage-validator-core && git commit "$@"
# fi
