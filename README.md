# Hacker Fellows Portal

# Requirements
- Node / NPM
- Postgres 
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

- Create local db
```
$ psql -c 'CREATE DATABASE hfportal;'
```

- Compile source code
```
$ gulp
```

- Run the app.  An admin user will automatically be created with user name
'admin@hackerfellows.com' and password 'password'
```
$ node server.js
```
