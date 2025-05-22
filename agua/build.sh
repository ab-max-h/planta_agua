#!/usr/bin/env bash

set -o errexit

pip install -r requirements.txt

python ~/agua/manage.py collectstatic --no-input
python ~/agua/manage.py migrate
