const signup = document.querySelector("#signup ");
const login = document.querySelector("#login");
const san = document.querySelector(".profileclass");

const logot2 = document.querySelector("#logout");

function storagehandle() {
    console.log("hello");
  
    if (localStorage.getItem("name") != null) {
      if (logot2) {
        console.log("okok");
        signup.style.display="none";
        login.style.display="none";
        logot2.style.display = "inline-block";
      }
      if (san) {
        san.style.display=""
        if(localStorage.admin){
          san.innerText = "Admin";
          san.setAttribute("href", "admin.html");
          san.setAttribute("target", "_self");
        }
      }
        
      
    } else {
      if (logot2) {
        logot2.style.display = "none";
        if (san) {
          san.style.display="none"
          if(localStorage.admin){
            san.innerText = "Profile";
            san.setAttribute("href", "profile.html");
            san.setAttribute("target", "_self");
          }
        }
       
      }
    }
}