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
          profile.innerText = "Admin";
          profile.setAttribute("href", "admin.html");
          profile.setAttribute("target", "_self");
        }
      }
        
      
    } else {
      if (logot2) {
        logot2.style.display = "none";
        if (profile) {
          profile.style.display="none"
          if(localStorage.admin){
            profile.innerText = "Profile";
            profile.setAttribute("href", "profile.html");
            profile.setAttribute("target", "_self");
            
          }
        }
       
        profile.style.display="none";
      }
    }
}