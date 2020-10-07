# react-hasura-exp

[![Netlify Status](https://api.netlify.com/api/v1/badges/f1f0dc8e-4900-4248-b00d-48c88214d114/deploy-status)](https://app.netlify.com/sites/wonderful-visvesvaraya-bd71b8/deploys)

### start dev env

```
./npm.sh npm install
docker-compose up
```

### access local app

[http://localhost:4000](http://localhost:4000)

### build assets for staging

```
./npm.sh npm run build:staging
```

## Build docker image

```
docker build --pull --rm -t=rehaex:latest .
```
