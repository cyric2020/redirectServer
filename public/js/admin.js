function login(){
  var id = document.getElementById('id').value;
  var password = document.getElementById('password').value;

  $.post(location.protocol + "/login", {username: id, password: password}, function(data) {
    if(data.error == true){
      alert("Incorrect details.");
      return;
    }
    if(data.Admin == false){
      alert("You logged in using a non admin account, try logging in through the normal login page: " + location.protocol + location.hostname + "/login")
    }else if(data.Admin == true){
      document.getElementById('login').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
    }
  });
}

window.onload = () => {
  params();
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
