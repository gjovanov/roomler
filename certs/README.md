# Generate Public/Private Key Pair for JWT

1. Run `ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwt-RS256.key` on Linux or `ssh-keygen -t rsa -N '""' -b 4096 -m PEM -f jwt-RS256.key` on Windows (Powershell)
2. Run `ssh-keygen -e -m PEM -f jwt-RS256.key > jwt-RS256.key.pub`


# Generating Self-assigned Certificate for Fastify HTTPS

`openssl req -newkey rsa:4096 -nodes -keyout https.key -x509 -days 365 -out https.crt`
