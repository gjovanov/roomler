set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gjovanov
IMAGE=roomler
docker build --network=host -t $USERNAME/$IMAGE:latest .
