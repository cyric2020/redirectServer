function login(){
  var id = document.getElementById('id').value;
  var password = document.getElementById('password').value;

  $.post(location.protocol + "/login", {username: id, password: password}, function(data) {
    if(data.error == true){
      alert("Incorrect details.");
      return;
    }
    if(data.Admin == true){
      alert("You logged in using a admin account, try logging in through the admin login page: " + location.protocol + location.hostname + "/admin")
    }else if(data.Admin == false){
      localStorage.setItem('username', id);
      localStorage.setItem('password', password);
      window.location = "/panel";
    }
  });
}
