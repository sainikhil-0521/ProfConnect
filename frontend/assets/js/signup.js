
var sign=document.querySelector("#submit");
sign.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log("signup clicked");
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:4000/users/signup",
        contentType: 'application/json',
        data: JSON.stringify({
            username:signupform.username.value,
            email:signupform.email.value,
            password:signupform.password.value,
            cpassword:signupform.cpassword.value,
        }),
       
        success: function (result) {
            console.log(result)
            if ("valid"== result.user) {
                
                   
                            if(result.token){
                                localStorage.setItem("name",result.token);
                                localStorage.setItem("uid",result.uid);
                                localStorage.setItem("username",result.uname);
                                localStorage.setItem("email",result.email);
                                localStorage.setItem("times",0)
                                // if(resp.admin) localStorage.admin=resp.admin
                                // storagehandle();
                                console.log("token",result.token);

                                window.open("./addUserDetails.html","_self");
                            }
                            else{
                                alert("enter right password!")
                            }
                        }

                    
            }
        })

    })
