var searchobj={}
var searchbool=false





$(".group-count").click((e) => {
  e.preventDefault()
  window.open("../chat/chat.html", "_self");
});



$(".searchbtn").click((e) => {
  e.preventDefault()
  let obj={}
  console.log("clicked");
  
  if(!searchbool){
    let form=document.forms["filter-form"]
    
    if(form.gender.value!="Gender")
      obj.gender=form.gender.value;
    if(form.level.value!="Level")
      obj.level="Level"+form.level.value;
    if(form.companyType.value!="Company Type")
      obj.companyType=form.companyType.value;
    if(form.country.value!="Choose Your Country")
      obj.country=form.country.value
  }
  else{
    obj=searchobj
    
  }  
  console.log(obj); 
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:4000/match/search",
    contentType: "application/json",
    headers: {
      periperi: localStorage.name,
      
    },
    data:JSON.stringify(obj),
    success: function (resp) {
      console.log(resp);
      if (resp !== "fail") {
        console.log("cool");
        document.querySelector(".row.g-4").innerHTML = "";
        resp.forEach((ele) => {
          document.querySelector(".row.g-4").innerHTML += `
          <div class="col-lg-6">
          <div class="group-item lab-item style-1">
              <div class="lab-inner d-flex flex-wrap align-items-center p-4">
                  <div class="lab-thumb me-md-4 mb-4 mb-md-0">
                      <img src=${ele.docs[0].profilePic} alt="img">
                  </div>
                  <div class="lab-content">
                      <h4>${ele.docs[0].username}</h4>
                      <p id=${ele.docs[0].username} >see profile</p>
                      <div id="popup1" class=${"zz"+ele.docs[0].username}>
                          <div class="popup">
                              <h2>Profile</h2>
                              <a class="close" id=${"z"+ele.docs[0].username}>&times;</a>
                              <div class="content">
                                  ${ele.docs[0].username}
                              </div>
                          </div>
                      </div>
                     
                      <div class="test"> <a href="#" class="lab-btn" id=${ele.docs[0]._id}>Connect</a></div>
                  </div>
              </div>
          </div>
      </div>`;
        });
        
      } else {
        $(".overlay2").addClass("target");
      }
    },
  });
});

if(localStorage.searching){
  searchobj=JSON.parse(localStorage.searching)
  searchbool=true
  console.log(searchobj);
  $(".searchbtn").trigger("click")
}



console.log(localStorage.name);
function fill() {
  storagehandle();
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:4000/match/matched",
    headers: {
      periperi: localStorage.name,
    },
    success: function (resp) {
      if (resp !== "notok") {
        console.log("good");
        console.log(resp);
        if (resp.requested.length) {
          $(".member-section").show();
          document.querySelector(".row.justify-content-center").innerHTML = "";
          resp.requested.forEach((ele) => {
            document.querySelector(".row.justify-content-center").innerHTML += `
          <div class="col-xl-2 col-lg-3 col-md-4 col-6">
          <div class="lab-item member-item style-1">
              <div class="lab-inner">
                  <div class="lab-thumb">
                      
                      <img src=${ele.profilePic} alt="member-img">
                  </div>
                  <div class="lab-content">
                      <h6><a href="#">${ele.username}</a> </h6>
                      <button type="button" class="btn btn-danger" style="color: white;" id=${
                        ele._id + "accept"
                      }>Accept</button>
                      <button type="button" class="btn btn-outline-secondary" id=${
                        ele._id + "ignore"
                      }>Ignore</button>
                  </div>
              </div>
          </div>
      </div>`;
          });
        } else {
          $(".member-section").hide();
        }
        if(!searchbool){
        document.querySelector(".row.g-4").innerHTML = "";
        resp.recommend.forEach((ele) => {
          document.querySelector(".row.g-4").innerHTML += `
          <div class="col-lg-6">
          <div class="group-item lab-item style-1">
              <div class="lab-inner d-flex flex-wrap align-items-center p-4">
                  <div class="lab-thumb me-md-4 mb-4 mb-md-0">
                      <img src=${ele.docs[0].profilePic} alt="img">
                  </div>
                  <div class="lab-content">
                      <h4>${ele.docs[0].username}</h4>
                      <p id=${ele.docs[0].username} >see profile</p>
                      <div id="popup1" class=${"zz"+ele.docs[0].username}>
                          <div class="popup">
                              <h2>Profile</h2>
                              <a class="close" id=${"z"+ele.docs[0].username}>&times;</a>
                              <div class="content">
                                  ${ele.docs[0].username}
                              </div>
                          </div>
                      </div>

                     
                      <div class="test"> <a href="#" class="lab-btn" id=${ele.docs[0]._id}>Connect</a></div>
                  </div>
              </div>
          </div>
      </div>`;
        });
      }
      searchbool=false
      if(localStorage.searching)
      localStorage.removeItem("searching")

      $("p").click((e)=>{
        $(".zz"+e.target.id).addClass("target")
      })

      $(".close").click((e) => {
       
        e.preventDefault()
       
        $(".overlay").removeClass("target");
        $(".overlay2").removeClass("target");
        $(".z"+e.target.id).removeClass("target")
      });


        $(".lab-btn").click((e) => {
          e.preventDefault();

          console.log(e.target.id);
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/match/connect",
            headers: {
              periperi: localStorage.name,
            },
            contentType: "application/json",
            data: JSON.stringify({
              toid: e.target.id,
            }),
            success: function (resp) {
              if (resp == "success") {
                console.log("cool");
                console.log(resp, e.target);
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
              } else {
                $(".overlay").addClass("target");
              }
            },
          });
        });

        $(".btn").click((e) => {
          e.preventDefault();
          console.log(e.target.id);
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/match/makeamatch",
            headers: {
              periperi: localStorage.name,
            },
            contentType: "application/json",
            data: JSON.stringify({
              toid: e.target.id,
            }),
            success: function (resp) {
              console.log("cool");
              e.target.parentNode.parentNode.parentNode.parentNode.remove();
              if (
                document
                  .querySelector(".row.justify-content-center")
                  .innerHTML.trim() == ""
              ) {
                $(".member-section").hide();
              }
            },
          });
        });
      } else {
        window.open("404.html", "_self");
      }
    },
    error: function (e) {
      console.log(e);
    },
  });
}
