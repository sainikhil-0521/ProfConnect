var ele=document.getElementById("editprofile");
ele.addEventListener("click",()=>{
    window.open("./addUserDetails.html","_self");
})

// api call to load  profile details of currently logged user
$.ajax({
    type: "POST",
    url: "http://127.0.0.1:4000/users/profile",
    contentType: 'application/json',
    data: JSON.stringify({
        name:localStorage.getItem("name")
    }),
    dataType: 'json',
    success: function (result) {
        console.log(result)
        if ("valid"== result.user) {
            console.log(result.user,"obj",result.obj[0]);
            var obj=result.obj[0];
            document.getElementById("username").innerText=obj.username;
           // $("#username").text(obj.username);
            $("#email").text(obj.email);
            $("#gender").text(obj.gender);
            $("#country").text(obj.country);
            $("#company").text(obj.company);
            $("#companytype").text(obj.companytype);
            $("#dob").text(moment(obj.dateOfBirth).utc().format('MM/DD/YYYY'));
            $("#role").text(obj.role);
            $("#experience").text(obj.yearsOfExperience);
            $("#domain").text(obj.domain);
            $("#summary").text(obj.summary);   
            $("#level").text(obj.level);
        }

                
    }
})
