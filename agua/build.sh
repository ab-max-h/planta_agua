#!/usr/bin/env bash

set -o errexit

pip install -r requirements.txt

cd $(dirname "$0")

python manage.py migrate

python manage.oy collectstatic --no-input
