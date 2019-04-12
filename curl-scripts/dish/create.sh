#!/bin/bash

API="http://localhost:4741"
URL_PATH="/dishes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "dish": {
      "imgUrl": "'"${IMGURL}"'",
      "title": "'"${TITLE}"'",
      "geolocation": "'"${GEO}"'",
      "timetaken": "'"${TIME}"'",
      "price": "'"${PRICE}"'"
    }
  }'

echo
