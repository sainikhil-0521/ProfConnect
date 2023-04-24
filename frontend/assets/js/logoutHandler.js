const signup = document.querySelector("#signup ");
const login = document.querySelector("#login");
const profile=document.querySelector("#profile")
const logot2 = document.querySelector("#logout");

function storagehandle() {
    console.log("hello");
  
    if (localStorage.getItem("name") != null) {
      if (logot2) {
        console.log("okok");
        signup.style.display="none";
        login.style.display="none";
        profile.style.display="inline-block"
        logot2.style.display = "inline-block";

      }
      if (profile) {
        
        if(localStorage.admin){
          profile.innerHTML = `<a href="admin.html">Admin</a>`
          
        }
      }
        
      
    } else {
      if (logot2) {
        logot2.style.display = "none";
        if (profile) {
          profile.style.display="none"
          if(localStorage.admin){
            profile.innerHTML = `<a href="profile.html">Profile</a>`
            
          }
        }
       
        profile.style.display="none";
      }
    }
}