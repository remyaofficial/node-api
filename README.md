## Requirements

- <a href="https://nodejs.org/en/download/" target="_blank">Node Js</a>
- Mysql
- Mongo
- Redis (<a href="https://redis.io/download" target="_blank">Linux</a> | <a href="https://github.com/tporadowski/redis/releases" target="_blank">Windows</a>)
- <a href="https://docs.nestjs.com/#installation" target="_blank">Nest CLI</a>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run prod
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# testing a service individually
# create a test script under testers/ folder and run using npx
$ npx ts-node -r tsconfig-paths/register testers/twilio-sendSms.ts
```


## Build

```bash
$ npm run build
```


## Documentation

- [Documentation](./docs/index.md)
  

## Code documentation

```bash
$ npx @compodoc/compodoc -p tsconfig.json -s
```


## API documentation

- <a href="http://localhost:3000/api-docs/" target="_blank">http://localhost:3000/api-docs/</a>


