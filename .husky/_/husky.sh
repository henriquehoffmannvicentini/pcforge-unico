#!/bin/sh
# husky shell helper (copied minimal) - ensures hooks run
if [ -z "${HUSKY_SKIP_INIT}" ]; then
  export HUSKY=1
fi
