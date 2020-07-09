set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gjovanov
IMAGE=roomler
docker build --network=host -t $USERNAME/$IMAGE:latest $(for i in `cat .arg`; do out+="--build-arg $i " ; done; echo $out;out="") .
