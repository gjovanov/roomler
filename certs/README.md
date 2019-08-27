# Generate Public/Private Key Pair

1. Run `ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwt-RS256.key` on Linux or `ssh-keygen -t rsa -N '""' -b 4096 -m PEM -f jwt-RS256.key` on Windows (Powershell)
2. Run `ssh-keygen -e -m PEM -f jwt-RS256.key > jwt-RS256.key.pub`
2. Enter path to you config folder e.g. `project_path\certs\key`
3. Enter Passphrase (also save it in `project_path\config\index.js` in passphrase property)
4. Re-enter Passphrase (Needs to match with previous step)
