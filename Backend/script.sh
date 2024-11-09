#!/bin/bash
SENDGRID_API_KEY=$4
email=$1
subject=$2
content=$3

curl -s --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header "Content-Type: application/json" \
  --data "{
    \"personalizations\": [{
      \"to\": [{\"email\": \"$email\"}]
    }],
    \"from\": {\"email\": \"kohlisamvaran@gmail.com\"},
    \"subject\": \"$subject\",
    \"content\": [{
      \"type\": \"text/plain\",
      \"value\": \"$content\"
    }]
  }"
