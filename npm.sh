#!/bin/bash

# `npm install` only works with the --no-bin-links flag
CMD=${*}
if [ ${1} = "npm install" ]; then
    CMD+=" --no-bin-links"
fi

# Add build env vars that need to be set for the build here.  For configuration
# of API endpoints, and other deployment environment specific settings.  This is
# static js/html/css builder. Served with stock nginx.
# -e BUILD_ENV_VAR="$BUILD_ENV_VAR"
docker run --rm \
    --name=node-$$ \
    -v $(pwd):/usr/src/app \
    -w "/usr/src/app" \
    node:12.18 ${CMD}