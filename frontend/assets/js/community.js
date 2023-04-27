var pageCount=1;
$(".group-count").click((e) => {
  window.open("../chat/chat.html", "_self");
});

console.log(localStorage.name);
function fill() {
  storagehandle();
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:4000/match/matched/1",
    headers: {
      periperi: localStorage.name,
    },
    success: function (resp) {
      if (resp !== "notok") {
        console.log("good");
        console.log(resp);
        if (resp.requested.length) {
           $(".member-section").show()
          document.querySelector(".row.justify-content-center").innerHTML=''
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
                      <button type="button" class="btn btn-danger" style="color: white;" id=${ele._id+"accept"}>Accept</button>
                      <button type="button" class="btn btn-outline-secondary" id=${ele._id+"ignore"}>Ignore</button>
                  </div>
              </div>
          </div>
      </div>`;
          });



        } else {
          $(".member-section").hide();
        }
        document.querySelector(".row.g-4").innerHTML=''
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
                      <p>see profile</p>
                     
                      <div class="test"> <a href="#" class="lab-btn" id=${ele.docs[0]._id}>Connect</a></div>
                  </div>
              </div>
          </div>
      </div>`;
        });

        $(".lab-btn").click((e)=>{
          e.preventDefault()
         console.log(e.target.id);
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/match/connect",
            headers: {
              periperi: localStorage.name,
            },
            contentType: 'application/json',
						data: JSON.stringify({
							toid:e.target.id,	
						}),
            success:function (resp) {
              console.log("cool");
                console.log(resp,e.target);
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
                
            }
        })
      })


      $(".btn").click((e)=>{
        e.preventDefault()
       console.log(e.target.id);
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:4000/match/makeamatch",
          headers: {
            periperi: localStorage.name,
          },
          contentType: 'application/json',
          data: JSON.stringify({
            toid:e.target.id,	
          }),
          success:function (resp) {
            console.log("cool");
             e.target.parentNode.parentNode.parentNode.parentNode.remove()
             if(document.querySelector(".row.justify-content-center").innerHTML.trim()==''){
                $(".member-section").hide();
             }

              
          }
      })
    })


      }
       else {
        window.open("404.html", "_self");
      }
    },
    error: function (e) {
      console.log(e);
    },
  });
}


//------->>Paginations<<---------

$(".prenxt").on("click",(e)=>{
  e.preventDefault()
  console.log("all blogs js ",pageCount);
  let page;
  if($(e.target).hasClass("icofont-rounded-double-left"))
    page=pageCount-1;
  else page=pageCount+1;

  if(page<1) page=1
  pageCount=page
   console.log("pagecount",pageCount);
      $.ajax({
          type: "GET",
          url: "http://127.0.0.1:4000/match/matched/"+page,
          contentType: 'application/json',
          headers: {
              periperi:localStorage.getItem("name")
          },
          
          success: function (resp) {
            if (resp !== "notok") {
              console.log("good");
              console.log(resp);
              if (resp.requested.length) {
                 $(".member-section").show()
                document.querySelector(".row.justify-content-center").innerHTML=''
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
                            <button type="button" class="btn btn-danger" style="color: white;" id=${ele._id+"accept"}>Accept</button>
                            <button type="button" class="btn btn-outline-secondary" id=${ele._id+"ignore"}>Ignore</button>
                        </div>
                    </div>
                </div>
            </div>`;
                });
      
      
      
              } else {
                $(".member-section").hide();
              }
              if(resp.recommend.length){
              document.querySelector(".row.g-4").innerHTML=''
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
                            <p>see profile</p>
                           
                            <div class="test"> <a href="#" class="lab-btn" id=${ele.docs[0]._id}>Connect</a></div>
                        </div>
                    </div>
                </div>
            </div>`;
              });

            }else{
              pageCount--;
            }
      
              $(".lab-btn").click((e)=>{
                e.preventDefault()
               console.log(e.target.id);
                $.ajax({
                  type: "POST",
                  url: "http://127.0.0.1:4000/match/connect",
                  headers: {
                    periperi: localStorage.name,
                  },
                  contentType: 'application/json',
                  data: JSON.stringify({
                    toid:e.target.id,	
                  }),
                  success:function (resp) {
                    console.log("cool");
                      console.log(resp,e.target);
                      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
                      
                  }
              })
            })
      
      
            $(".btn").click((e)=>{
              e.preventDefault()
             console.log(e.target.id);
              $.ajax({
                type: "POST",
                url: "http://127.0.0.1:4000/match/makeamatch",
                headers: {
                  periperi: localStorage.name,
                },
                contentType: 'application/json',
                data: JSON.stringify({
                  toid:e.target.id,	
                }),
                success:function (resp) {
                  console.log("cool");
                   e.target.parentNode.parentNode.parentNode.parentNode.remove()
                   if(document.querySelector(".row.justify-content-center").innerHTML.trim()==''){
                      $(".member-section").hide();
                   }
      
                    
                }
            })
          })
      
      
            }
             else {
              window.open("404.html", "_self");
            }
          },
          error: function (e) {
            console.log(e);
          },
      })
})
