# redis-exp-subscription-sample

This repo contains a docker-compose file that contains exposed `redis` and `redis-commander` services.

## Run

1. Run redis with commander `docker-compose up`.
2. In redis commander select third db with `select 3`.
3. Run sample `node index`.
4. Inspect logs and redis commander :)

## Resources

- Base on [this](https://stackoverflow.com/a/48293162) stackoverflow answer.

