var sub=document.querySelector("#submit");
sub.addEventListener("click",(e)=>{
    e.preventDefault();
    var email=document.querySelector("#email").value
   var pwd=document.querySelector("#password").value
    console.log("email pwd",email,pwd);
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:4000/users/valid",
        contentType: 'application/json',
        data: JSON.stringify({
            email:email,
           password:pwd,	
        }),
        dataType: 'json',
        success:function (resp){
            console.log(resp);
            if(resp.token){
                localStorage.setItem("name",resp.token);
                localStorage.setItem("username",resp.username)
                localStorage.setItem("times",0)
                storagehandle();
                 alert("user logged in")
                // if(resp.admin) localStorage.admin=resp.admin
                 

                 window.open("./index.html","_self");
            }
            else{
                alert("enter right password!")
            }
        }

    })
});

var logot=document.querySelector("#logout");
logot.addEventListener("click",()=>{
    localStorage.removeItem("name");
    storagehandle();
})
window.onload=storagehandle;
window.onfocus=storagehandle;
