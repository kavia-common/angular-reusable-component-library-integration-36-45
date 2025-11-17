#!/bin/bash
cd /home/kavia/workspace/code-generation/angular-reusable-component-library-integration-36-45/angular_application
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

