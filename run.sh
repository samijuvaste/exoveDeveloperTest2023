#!/bin/bash
set -e

BASE_DIR="$(git rev-parse --show-toplevel)"
cd "$BASE_DIR/docker"

docker compose up app
docker compose down
