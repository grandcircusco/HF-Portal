var express = require('express');
// var fellow = require('./fellow');
// var company = require('./company');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// GET /fellows - list fellows page
app.get('/fellows', function getFellows(req, res) {
  res.send('GET request to fellows page');
  res.send()
});

// GET /companies - list all companies
app.get('/companies', function getCompanies(req, res) {
  res.send('GET request - list all companies');
});

// POST /register/fellow - create a new fellow record
app.post('/register/fellow', function postFellow(req, res) {
  res.send('POST request - create a new fellow record');
});

// POST /register/company - create a new company record
app.post('/register/company', function postCompany(req, res) {
  res.send('POST request - create a new company record');
});

app.route('/fellows/:id')

// PUT /fellows/:id - updates an existing fellow record
  .put(function putFellow(req, res) {
    res.send('PUT request - update a fellow record');
  })

// DELETE /fellows/:id - deletes an existing fellow record
  .delete(function deleteFellow(req, res) {
    res.send('DELETE request - delete a fellow record');
  });

app.route('/companies/:id')
// PUT /companies/:id - updates an existing company record
  .put(function putCompany(req, res) {
    res.send('PUT request - update a company record');
  })

// DELETE /companies/:id - deletes an existing company record
  .delete(function deleteCompany(req, res) {
    res.send('DELETE request - delete a company record');
  });

var server = app.listen(3000, function createServer() {
  var host = server.address().address;
  var port = server.address().port;
});


