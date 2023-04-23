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
    //   if (san) {
    //     // san.innerText = "Profile";
    //     // san.setAttribute("href", "/frontend/html/profile.html");
    //     // san.setAttribute("target", "");
    //     if(localStorage.admin){
    //       san.innerText = "Admin";
    //       san.setAttribute("href", "/frontend/html/admin.html");
    //       san.setAttribute("target", "");
    //     }
        
      
    } else {
      if (logot2) {
        logot2.style.display = "none";
        profile.style.display="none";
      }
    }
}