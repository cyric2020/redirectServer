window.onload = () => {
  if(localStorage.getItem('loggedin') != 'true'){
    window.location = 'http://localhost:3000/login';
  }
  params();
  fillTables();
}

function params(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if(urlParams.has('window')){
    openWindow(urlParams.get('window'));
  }
}

function insertParam(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substr(1).split('&');
    let i=0;

    for(; i<kvp.length; i++){
        if (kvp[i].startsWith(key + '=')) {
            let pair = kvp[i].split('=');
            pair[1] = value;
            kvp[i] = pair.join('=');
            break;
        }
    }

    if(i >= kvp.length){
        kvp[kvp.length] = [key,value].join('=');
    }

    // can return this or...
    let params = kvp.join('&');

    // reload page with new params
    document.location.search = params;
}

function fillTables(){
  fillDomainTable();
  createRedirects();
}

function fillDomainTable(){
  var table = document.getElementById('domainTable');
  table.innerHTML = "";
  $.post(location.protocol + "/domains", function(data) {
    for(i = 0; i < data.length; i++){
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.innerText = data[i];
      var edit = document.createElement('td');
      var icon = document.createElement('i');
      icon.classList.add('fas');
      icon.classList.add('fa-pencil-alt');
      edit.addEventListener('click', function (){
        openEditModeDomains(this);
      })
      edit.appendChild(icon);

      table.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(edit);
    }
  });
}

function openEditModeDomains(btn){
  var root = btn.parentNode.childNodes;
  if(root[1].childNodes[0].classList.contains('fa-pencil-alt')){
    var inputTd = root[0];
    var input = document.createElement('input');
    inputTd.setAttribute('oldData', inputTd.innerText);
    input.value = inputTd.innerText;
    inputTd.innerText = "";
    inputTd.appendChild(input);
    var btnTd = root[1].childNodes;
    btnTd[0].classList.remove('fa-pencil-alt');
    btnTd[0].classList.add('fa-save');
  }else if(root[1].childNodes[0].classList.contains('fa-save')){
    var inputTd = root[0];
    inputTd.innerText = root[0].childNodes[0].value;
    var btnTd = root[1].childNodes;
    btnTd[0].classList.remove('fa-save');
    btnTd[0].classList.add('fa-pencil-alt');

    updateDomain(inputTd.getAttribute('oldData'), root[0].childNodes[0].data);
  }
}

function createRedirects(){
  var mainDiv = document.getElementById('redirectsContainer');
  mainDiv.innerHTML = "";
  $.post(location.protocol + "/redirects", function(data) {
    var domains = data;
    for(i = 0; i < domains.length; i++){
      var div = document.createElement('div');
      div.classList.add('redirect');
      var h2 = document.createElement('h2');
      h2.innerText = domains[i][0];

      div.appendChild(h2);
      mainDiv.appendChild(div);

      for(o = 1; o < domains[i].length; o++){
        var tr = document.createElement('tr');
        var tdUrl = document.createElement('td');
        var tdRedirect = document.createElement('td');
        var tdEdit = document.createElement('td');
        var icon = document.createElement('i');
        var tdDelete = document.createElement('td');
        var iconDelete = document.createElement('i');

        tdUrl.innerText = domains[i][o][0];
        tdRedirect.innerText = domains[i][o][1];

        icon.classList.add('fas');
        icon.classList.add('fa-pencil-alt');

        iconDelete.classList.add('fas');
        iconDelete.classList.add('fa-trash-alt');

        tdEdit.appendChild(icon);
        tdDelete.appendChild(iconDelete);
        tr.appendChild(tdUrl);
        tr.appendChild(tdRedirect);
        tr.appendChild(tdEdit);
        tr.appendChild(tdDelete);
        div.appendChild(tr);

        tdEdit.addEventListener('click', function (){
          openEditModeRedirect(this);
        });

        tdDelete.addEventListener('click', function(){
          deleteRedirect(this);
        });
      }

      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var button = document.createElement('button');
      var input1 = document.createElement('input');
      var input2 = document.createElement('input');

      button.innerHTML = '<i class="fas fa-plus-square"></i>';

      td1.appendChild(input1);
      td2.appendChild(input2);
      td3.appendChild(button);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      div.appendChild(tr);

      button.addEventListener('click', function(){
        createRedirect(this.parentNode.parentNode.parentNode.childNodes[0].innerText, this.parentNode.parentNode.childNodes[1].childNodes[0].value, this.parentNode.parentNode.childNodes[0].childNodes[0].value);
      })
    }
  })
}

function fillRedirectTable(){
  var table = document.getElementById('redirectTable');
  table.innerHTML = "";
  $.post(location.protocol + "/redirects", function(data) {
    for(i = 0; i < data.length; i++){
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.innerText = data[i];
      var edit = document.createElement('td');
      var icon = document.createElement('i');
      icon.classList.add('fas');
      icon.classList.add('fa-pencil-alt');
      edit.addEventListener('click', function (){
        openEditModeDomains(this);
      })
      edit.appendChild(icon);

      table.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(edit);
    }
  });
}

function openEditModeRedirect(btn){
  var root = btn.parentNode.childNodes;
  console.log(root);
  if(root[2].childNodes[0].classList.contains('fa-pencil-alt')){
    var inputTd1 = root[0];
    var inputTd2 = root[1];
    var input = document.createElement('input');
    var input2 = document.createElement('input');
    inputTd1.setAttribute('oldData', inputTd1.innerText);
    input.value = inputTd1.innerText;
    inputTd1.innerText = "";
    inputTd1.appendChild(input);
    inputTd2.setAttribute('oldData', inputTd2.innerText);
    input2.value = inputTd2.innerText;
    inputTd2.innerText = "";
    inputTd2.appendChild(input2);
    var btnTd = root[2].childNodes;
    btnTd[0].classList.remove('fa-pencil-alt');
    btnTd[0].classList.add('fa-save');
  }else if(root[2].childNodes[0].classList.contains('fa-save')){
    var inputTd1 = root[0];
    inputTd1.innerText = root[0].childNodes[0].value;
    var inputTd2 = root[1];
    inputTd2.innerText = root[1].childNodes[0].value;
    var btnTd = root[2].childNodes;
    btnTd[0].classList.remove('fa-save');
    btnTd[0].classList.add('fa-pencil-alt');

    updateRedirects(inputTd1.getAttribute('oldData'), root[0].childNodes[0].data, inputTd2.getAttribute('oldData'), root[1].childNodes[0].data, btn.parentNode.parentNode.childNodes[0].innerText);
  }
}

function preOpenWindow(windowName){
  insertParam('window', windowName);
  openWindow(windowName);
}

function openWindow(windowName){
  var divs = document.getElementById('selectContainer').childNodes;
  for(i = 0; i < divs.length; i++){
    if(divs[i].classList != undefined){
      if(!divs[i].classList.contains('hidden') && divs[i].id != windowName){
        divs[i].classList.add('hidden');
      }else if(divs[i].classList.contains('hidden') && divs[i].id == windowName){
        divs[i].classList.remove('hidden');
      }
    }
  }
}

function updateDomain(old, newDomain){
  $.post(location.protocol + "/updatedomains", {old: old, new: newDomain}, function(data) {
    console.log(data);
    fillDomainTable();
  });
}

function updateRedirects(oldUrl, newUrl, oldRedirect, newRedirect, domain){
  console.log(`${oldUrl} ${newUrl} ${oldRedirect} ${newRedirect}`);
  $.post(location.protocol + "/updateRedirects", {oldUrl: oldUrl, newUrl: newUrl, oldRedirect: oldRedirect, newRedirect: newRedirect, Domain: domain}, function(data) {
    console.log(data);
    fillDomainTable();
  });
}

function createRedirect(domain, redirect, url){
  if(redirect == undefined || url == undefined || redirect == "" || url == ""){
    console.log("Error");
    alert("One field contains empty data.");
    return;
  }
  console.log(redirect);
  $.post(location.protocol + "/addRedirect", {Domain: domain, Url: url, Redirect: redirect}, function(data) {
    console.log(data);
    createRedirects();
  });
}

function deleteRedirect(btn){
  var domain = btn.parentNode.parentNode.childNodes[0].innerText;
  var url = btn.parentNode.childNodes[0].innerText;
  var redirect = btn.parentNode.childNodes[1].innerText;
  $.post(location.protocol + "/deleteRedirect", {Domain: domain, Url: url, Redirect: redirect}, function(data) {
    createRedirects();
  });
}
