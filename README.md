# Evado Exchange App

Buying and selling stocks by traders.

- [Evado Platform](https://github.com/mkhorin/evado)
- [Step-by-step tutorial](http://nervebit.com)

## Docker installation

Clone application to /app
```sh
cd /app
docker-compose up -d mongo
docker-compose up --build installer
docker-compose up -d server
```
Usage - http://localhost:3000

Or get Docker Toolbox IP address
```sh
docker-machine ip default
```
http://{dockerIP}:3000

Sign in as trader:
```sh
Email: b@b.b
Password: 123456

Email: s@s.s
Password: 123456

Email: t@t.t
Password: 123456
```
Sign in as administrator:
```sh
Email: a@a.a
Password: 123456
```

## Typical installation

#### Install environment
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/download-center/community)

#### Linux
Clone application to /app
```sh
cd /app
npm install
NODE_ENV=development node console/install
NODE_ENV=development node console/start
```

#### Windows
Clone application to c:/app
```sh
cd c:/app
npm install
set NODE_ENV=development
node console/install
node console/start
```

#### Usage

**http://localhost:3000**

Sign in as trader:
```sh
Email: b@b.b
Password: 123456

Email: s@s.s
Password: 123456

Email: t@t.t
Password: 123456
```
Sign in as administrator:
```sh
Email: a@a.a
Password: 123456
```

## Tutorial
- [Build App Without Coding](http://nervebit.com)