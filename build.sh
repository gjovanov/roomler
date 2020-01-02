set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gjovanov
IMAGE=roomler
docker build -t $USERNAME/$IMAGE:latest .
