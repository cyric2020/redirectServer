var logins = [["#1Hmu", "SH@e6"]]

function login(){
  var id = document.getElementById('id').value;
  var password = document.getElementById('password').value;

  for(i = 0; i < logins.length; i++){
    if(id == logins[i][0] && password == logins[i][1]){
      localStorage.setItem('loggedin', 'true');
      window.location = "http://localhost:3000/panel";
    }else{
      alert("incorrect login");
    }
  }
}
