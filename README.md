# Hacker Fellows Portal

# Requirements
- Node / NPM
- Postgres or Docker
- Gulp

# Setup for Development

- Clone repository
```
$ git clone git@github.com:grandcircusco/HF-Portal.git
```

- Install local requirements
```
$ npm install
```

- Compile source code
```
$ gulp
```

### Using local Postgres install
- Create local db
```
$ psql -c 'CREATE DATABASE hfportal;'
```
- Run the app.  An admin user will automatically be created with user name
'admin@hackerfellows.com' and password 'password'
```
$ node server.js
```

### Using Docker
- Run local db
```
$ ./localdb
```
- Run the app.  An admin user will automatically be created with user name
'admin@hackerfellows.com' and password 'password'
```
$ ./run
```
