window.onload = () => {
  if(localStorage.getItem('loggedin') != 'true'){
    window.location = 'http://localhost:3000/login';
  }
}

function openWindow(windowName){
  var divs = document.getElementById('selectContainer').childNodes;
  for(i = 0; i < divs.length; i++){
    if(divs[i].classList != undefined){
      if(divs[i].classList.contains('hidden') && divs[i].id == windowName){
        divs[i].classList.remove('hidden');
      }else if(!divs[i].classList.contains('hidden')){
        divs[i].classList.add('hidden');
      }
    }
  }
}
