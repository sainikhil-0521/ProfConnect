var ele=document.getElementById("editprofile");
ele.addEventListener("click",()=>{
    window.open("./addUserDetails.html","_self");
})

// api call to load  profile details of currently logged user
$.ajax({
    type: "GET",
    url: "http://127.0.0.1:4000/users/profile",
    contentType: 'application/json',
    data: JSON.stringify({
        periperi:localStorage.getItem("name")
    }),
    dataType: 'json',
    success: function (result) {
        console.log(result)
        if ("valid"== result.user) {
            let e=document.getElementById("");
               
            
        }

                
    }
})
