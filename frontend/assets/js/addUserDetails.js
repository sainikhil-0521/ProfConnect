
document.querySelector("#key").value=localStorage.name;
document.querySelector("#username").value=localStorage.username;
document.querySelector("#email").value=localStorage.email;
console.log("key updated");

const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        allInput = form.querySelectorAll(".first input");

        // form.classList.add('secActive');
nextBtn.addEventListener("click", (e)=> {
  e.preventDefault()
//     allInput.forEach(input => {
        // if(input.value != ""){
            form.classList.add('secActive');
        // }else{
        //     form.classList.remove('secActive');
        // }
//     })
})

backBtn.addEventListener("click", () => form.classList.remove('secActive'));

document.querySelectorAll("input").forEach((e)=>{e.readOnly=true;})
document.querySelectorAll("option").forEach((e)=>{e.style.display="none";})

document.querySelector(".eimg").addEventListener("click",(e)=>{
    document.querySelectorAll("option").forEach((e)=>{e.style.display="";})
    document.querySelectorAll("input").forEach((e)=>{e.readOnly=false;})

})
$(".cancel").click((e)=>{
    window.open("./index.html","_self")
})


// $(".submit").click((e)=> {
//   e.preventDefault()
//   var formData = new FormData($('#myform')[0]);
//   console.log($('#myform')[0]);
//   formData.append("CustomField", "This is some extra data, testing");
//   //formData.append('tax_file', $('input[type=file]')[0].files[0]); 
//   console.log("form data",formData);
//   $.ajax({
//     type: "POST",
//     enctype: 'multipart/form-data',
//     url: "http://127.0.0.1:4000/users/addUserDetails",
//     headers:{
//       uid:localStorage.getItem("uid"),
//     },
//     // contentType: "application/json",
//     data: formData,
//     processData: false,
//     contentType: false,
//     dataType: "json",
//     success: function (result) {
//       console.log(result);
//      // window.open("./index.html")
//     },
//   });
// })



//window.onload = fill;
