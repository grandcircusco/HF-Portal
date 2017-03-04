# Hacker Fellows Portal

# Requirements
- Node / NPM
- Postgres 
- Gulp

# Setup

1. Clone repository
`$ git clone git@github.com:grandcircusco/HF-Portal.git`

2. Install local requirements
`$ npm install`

3. Create local db
`$ psql -c 'CREATE DATABASE hfportal;'`

4. Compile source code
`$ gulp`

5. Run the app.  An admin user will automatically be created with user name
'admin@hackerfellows.com' and password 'password'
`$ node server.js`
