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
    root: path.join(__dirname + "/public/html")
  };

  var fileName = 'login.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      throw(err);
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

app.get('/admin', (req, res) => {
  var options = {
    root: path.join(__dirname + "/public/html")
  };

  var fileName = 'admin.html';
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

app.post('/login', (req, res) => {
  var body = req.body;
  if(body.username == undefined || body.username == ""){
    res.send("No username defined.");
    return;
  }else if(body.password == undefined || body.password == ""){
    res.send("No password defined.");
    return;
  }

  var json = pullAccounts();

  for(i = 0; i < json.Accounts; i++){
    console.log(json.Accounts[i]);
  }
});

app.post('/domains', (req, res) => {
  var json = pullJson();
  res.send(pullDomains(json));
});

app.post('/updateDomains', (req, res) => {
  var body = req.body;
  if(body.old == undefined){
    res.send("No old domain defined.");
    return;
  }else if(body.new == undefined){
    res.send("No new domain defined.");
    return;
  }
  var old = body.old;
  var newDomain = body.new;
  var json = pullJson();
  var domains = json.Domains;

  for(i = 0; i < domains.length; i++){
    if(domains[i].Domain == old){
      domains[i].Domain = newDomain;
    }
  }

  writeJson(json);

  res.sendStatus(200);
});

app.post('/updateRedirects', (req, res) => {
  var body = req.body;
  if(body.oldUrl == undefined){
    res.send("No oldUrl domain defined.");
    return;
  }else if(body.newUrl == undefined){
    res.send("No newUrl domain defined.");
    return;
  }else if(body.oldRedirect == undefined){
    res.send("No oldRedirect domain defined.");
    return;
  }else if(body.newRedirect == undefined){
    res.send("No newRedirect domain defined.");
    return;
  }
  var oldUrl = body.oldUrl;
  var newUrl = body.newUrl;
  var oldRedirect = body.oldRedirect;
  var newRedirect = body.newRedirect;
  var domain = body.Domain
  var json = pullJson();

  // psudeo code: remove the old one from the old domain and add the new one into the domain.

  var domains = json.Domains;
  for(i = 0; i < domains.length; i++){
    var continueRunning = false;
    if(domains[i].Domain == domain){
      for(o = 0; o < domains[i].Redirects.length; o++){
        if(domains[i].Redirects[o].Origin == oldUrl){
          domains[i].Redirects.splice(o, 1);
          continueRunning = true;
        }
        console.log(domains[i].Redirects[o]);
      }
    }

    if(domains[i].Domain == domain && continueRunning == true){
      domains[i].Redirects.push({"Origin": newUrl, "Redirect": newRedirect});
      writeJson(json);
    }
  }

  writeJson(json);

  res.sendStatus(200);
});

app.post('/redirects', (req, res) => {
  var json = pullJson();
  res.send(pullRedirectsAndDomains(json));
});

app.post('/addRedirect', (req, res) => {
  var body = req.body;
  if(body.Domain == undefined){
    res.send("No Domain domain defined.");
    return;
  }else if(body.Url == undefined){
    res.send("No Url domain defined.");
    return;
  }else if(body.Redirect == undefined){
    res.send("No Redirect domain defined.");
    return;
  }
  var json = pullJson();

  for(i = 0; i < json.Domains.length; i++){
    if(json.Domains[i].Domain == body.Domain){
      json.Domains[i].Redirects.push({Origin: body.Url, Redirect: body.Redirect})
    }
  }

  writeJson(json);
  res.sendStatus(200);
});

app.post('/deleteRedirect', (req, res) => {
  var body = req.body;
  if(body.Domain == undefined){
    res.send("No Domain domain defined.");
    return;
  }else if(body.Url == undefined){
    res.send("No Url domain defined.");
    return;
  }else if(body.Redirect == undefined){
    res.send("No Redirect domain defined.");
    return;
  }
  var json = pullJson();

  for(i = 0; i < json.Domains.length; i++){
    if(json.Domains[i].Domain == body.Domain){
      for(o = 0; o < json.Domains[i].Redirects.length; o++){
        if(json.Domains[i].Redirects[o].Origin == body.Url && json.Domains[i].Redirects[o].Redirect == body.Redirect){
          json.Domains[i].Redirects.splice(o, 1);
          writeJson(json);
        }
      }
    }
  }
  res.sendStatus(200);
});

app.post('/addDomain', (req, res) => {
  var body = req.body;
  if(body.Domain == undefined){
    res.send("No Domain defined.");
    return;
  }
  var json = pullJson();

  json.Domains.push({ "Domain": body.Domain, "Redirects": [] });

  writeJson(json);
  res.sendStatus(200);
});

app.post('/deleteDomain', (req, res) => {
  var body = req.body;
  if(body.Domain == undefined){
    res.send("No Domain defined.");
    return;
  }
  var json = pullJson();

  for(i = 0; i < json.Domains.length; i++){
    if(json.Domains[i].Domain == body.Domain){
      json.Domains.splice(i, 1);
    }
  }

  writeJson(json);
  res.sendStatus(200);
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

function pullAccounts(){
  var rawdata = fs.readFileSync('accounts.json');
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

function writeJson(json){
  var data = JSON.stringify(json, null, 2);
  fs.writeFile('redirects.json', data, (err) => {
    if(err){
      throw err;
    }
    console.log('DataWriteSuccesfful');
  })
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

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
