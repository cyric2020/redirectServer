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
  console.log(newDomain);
  $.post(location.protocol + "/updatedomains", {old: old, new: newDomain}, function(data) {
    console.log(data);
    fillDomainTable();
  });
}
