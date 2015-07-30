var express = require('express');
// var fellow = require('./fellow');
// var company = require('./company');

var app = express();

app.get('/', function (req, res) {
  res.send('source/app/home/home.html');
});


// GET /fellows - get all fellows
app.get('/api/fellows', function getFellows(req, res) {
  res.send('GET request to fellows page');
});

// POST /api/fellows - create a new fellow record
app.post('/api/fellows', function postFellow(req, res) {
  res.send('POST request - create a new fellow record');
});

// PUT /api/fellows/:id - updates an existing fellow record
app.put('/api/fellows/:id', function putFellow(req, res) {
  res.send('PUT request - update a fellow record');
})

// DELETE /api/fellows/:id - deletes an existing fellow record
app.delete(function deleteFellow(req, res) {
  res.send('DELETE request - delete a fellow record');
});


// GET /api/companies - get all companies
app.get('/api/companies', function getCompanies(req, res) {
  res.send('GET request - list all companies');
});

// POST /api/companies - create a new company record
app.post('/api/companies', function postCompany(req, res) {
  res.send('POST request - create a new company record');
});

// PUT /api/companies/:id - updates an existing company record
app.put('/api/companies/:id', function putCompany(req, res) {
    res.send('PUT request - update a company record');
})

// DELETE /api/companies/:id - deletes an existing company record
app.delete('/api/companies/:id', function deleteCompany(req, res) {
    res.send('DELETE request - delete a company record');
});

var server = app.listen(3000, function createServer() {
  var host = server.address().address;
  var port = server.address().port;
});


