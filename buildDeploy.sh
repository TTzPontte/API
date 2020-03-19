#!/bin/bash

if [ "$ENV" == "prod" ]
then
  echo -n "Deploying to prod. Confirm? [y/N] "
  read confirmation

  if [ "$confirmation" != "y" -a "$confirmation" != "Y" ]
  then
    exit
  fi
fi


sam build 

sam package --s3-bucket $SAM_BUCKET --output-template-file ./serverless-output.yaml

sam deploy --stack-name torre-controle-backend-$ENV --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides \
    Environment=$ENV \
    CognitoUserPoolId=$COGNITO_ID \
  --template-file ./serverless-output.yaml
