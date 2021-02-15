const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
  res.send('Hey!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/login', (req, res) => {
  var options = {
    root: path.join(__dirname)
  };

  var fileName = 'login.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/panel', (req, res) => {
  var options = {
    root: path.join(__dirname + "/public/html")
  };

  var fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/:redirect', (req, res) => {
  var host = req.hostname;
  var json = pullJson();

  if(jsonArrayDomain(json.Domains, host)){
    var index = getJsonIndex(json.Domains), host;
    var redirect = getRedirectUrl(json.Domains[index].Redirects, req.params.redirect);
    res.redirect(redirect)
  }else{

  }
});

app.post('/domains', (req, res) => {
  var json = pullJson();
  res.send(pullDomains(json));
});

app.post('/redirects', (req, res) => {
  console.log(req.body);
  var json = pullJson();
  res.send(pullRedirectsAndDomains(json));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function jsonArrayDomain(json, contains){
  returnTrue = false;
  for(i = 0; i < json.length; i++){
    if(json[i].Domain == contains){
      returnTrue = true;
    }
  }

  return returnTrue;
}

function getRedirectUrl(redirects, origin){
  var redirect = "";
  for(i = 0; i < redirects.length; i++){
    if(redirects[i].Origin == origin){
      redirect = redirects[i].Redirect;
    }
  }

  return redirect;
}

function getJsonIndex(json, contains){
  var index = 0;
  for(i = 0; i < json.length; i++){
    if(json[i].hasOwnProperty(contains)){
      index = i
    }
  }

  return index;
}

function pullJson(){
  var rawdata = fs.readFileSync('redirects.json');
  var data = JSON.parse(rawdata);
  return data;
}

function pullDomains(json){
  var domain = json.Domains;
  var domains = [];
  for(i = 0; i < domain.length; i++){
    domains.push(domain[i].Domain);
  }

  return domains;
}

function pullRedirectsAndDomains(json){
  var domain = json.Domains;
  var domains = [];
  for(i = 0; i < domain.length; i++){
    var array = [domain[i].Domain];
    for(o = 0; o < domain[i].Redirects.length; o++){
      var array2 = [domain[i].Redirects[o].Origin, domain[i].Redirects[o].Redirect];
      array.push(array2);
    }
    domains.push(array);
  }

  return domains;
}
