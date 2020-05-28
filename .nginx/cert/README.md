# Generating Self-assigned Certificate for HTTPS
`openssl req -newkey rsa:4096 -nodes -keyout https.key -x509 -days 365 -out https.crt`
