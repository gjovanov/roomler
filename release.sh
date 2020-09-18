set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gjovanov
IMAGE=roomler
BUMP=patch

# ensure we're up to date
git pull

# bump version
# npm version $BUMP
docker run --rm -v "$PWD":/app treeder/bump $BUMP
docker run --rm -v "$PWD":/app -w /app node:alpine npm version $BUMP
version=`cat VERSION`
echo "version: $version"

# run build
./build.sh

# tag it
git add -A
git commit -m "version $version"
git tag -a "$version" -m "version $version"
git push
git push --tags
docker tag $USERNAME/$IMAGE:latest $USERNAME/$IMAGE:$version

# push it
docker push $USERNAME/$IMAGE:latest
docker push $USERNAME/$IMAGE:$version
