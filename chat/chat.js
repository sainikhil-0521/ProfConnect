

var socket = io("http://localhost:4050",{query:`uname=${localStorage.username}`});
$(document).ready(function () {
  $("#action_menu_btn").click(function () {
    $(".action_menu").toggle();

  });
  
});

socket.on("initial_connection",(msg)=>{
  console.log(msg);

  msg.forEach(element => {
    document.querySelector(".contacts").innerHTML+=`
      <li class="" id=${element.username}>
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img src=${element.image} class="rounded-circle user_img">
            <span class="online_icon"></span>
          </div>
          <div class="user_info">
            <span>${element.username}</span>
            <span class="new_msg">${element.count?element.count:""}</span>
          </div>
        </div>
      </li>`;

      document.querySelector(".chatting").innerHTML+=`<div class="card cardd" id=${element.username+"div"}>
						<div class="card-header msg_head">
							<div class="d-flex bd-highlight">
								<div class="img_cont">
									<img src=${element.image} class="rounded-circle user_img">
									<span class="online_icon"></span>
								</div>
								<div class="user_info">
									<span>${element.username}</span>
									
								</div>
								<div class="video_cam">
									<span><i class="fas fa-video"></i></span>
									<span><i class="fas fa-phone"></i></span>
								</div>
							</div>
							<span id="action_menu_btn"><i class="fas fa-ellipsis-v"></i></span>
							<div class="action_menu">
								<ul>
									<li><i class="fas fa-user-circle"></i> View profile</li>
									<li><i class="fas fa-users"></i> Add to close friends</li>
									<li><i class="fas fa-plus"></i> Add to group</li>
									<li><i class="fas fa-ban"></i> Block</li>
								</ul>
							</div>
						</div>
            <div class="card-body msg_card_body"></div></div>`;
            element.messages.forEach(ele => {
              let elemsg=ele.split("~~")
              let datee=new Date(Number(elemsg[1]))
              console.log(elemsg);
              document.querySelector("#"+element.username+"div .msg_card_body").innerHTML+=`
                
                <div class="d-flex justify-content-${elemsg[0]==localStorage.username?"end":"start"} mb-4">
                  
                  <div class="msg_cotainer${(elemsg[0]==localStorage.username)?"_send":""}">
                    ${elemsg[2]}
                    <span class="msg_time">${datee.getUTCDate()+"-"+datee.getUTCMonth()+"-"+datee.getUTCFullYear()}</span>
                  </div>
                </div>`
            })
            document.querySelector("#"+element.username+"div").innerHTML+=`<div class="card-footer">
							<div class="input-group">
								<div class="input-group-append">
									<span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
								</div>
								<textarea name="" class="form-control type_msg" placeholder="Type your message..."></textarea>
								<div class="input-group-append">
									<span class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
								</div>
							</div>
					</div>`
  });
  

  $(".contacts li").click((e)=>{
    if(prev) prev.classList.toggle("active")
    e.target.classList.toggle("active")
    e.target.querySelector(".new_msg").innerText=''
  
    
    $("#"+prevdiv.id).toggleClass("cardd");
    $("#"+e.target.id+"div").toggleClass("cardd");
    console.log($("#"+e.target.id+"div")[0]);
    prevdiv=document.querySelector("#"+e.target.id+"div")
    prev=e.target
    socket.emit('chat message2',localStorage.username,e.target.id)
  })

  $(".fa-location-arrow").click((e)=>{
    if($(".type_msg").val() !== ""){
      socket.emit('chat message',$(".type_msg").val(),localStorage.username,$(".active")[0].id)
      document.querySelector("#"+$(".active")[0].id+"div .msg_card_body").innerHTML+=`
                
                <div class="d-flex justify-content-end mb-4">
                  
                  <div class="msg_cotainer_send">
                    ${$(".type_msg").val()}
                    <span class="msg_time">${new Date()}</span>
                  </div>
                </div>`
      $(".type_msg").val("")
    }
  })

})


socket.on("chat message",(msg,msgcount)=>{
  console.log(msg);
  let elemsg=msg.split("~~")
  console.log(elemsg);
  document.querySelector("#"+elemsg[0]+"div .msg_card_body").innerHTML+=`
                
                <div class="d-flex justify-content-start mb-4">
                  
                  <div class="msg_cotainer">
                    ${elemsg[2]}
                    <span class="msg_time">${elemsg[1]}</span>
                  </div>
                </div>`;

  if(!$("#"+elemsg[0]).hasClass("active")){
    document.querySelector("#"+elemsg[0]+" div .user_info .new_msg").innerText=msgcount
  }
  else{
    socket.emit('chat message2',localStorage.username,elemsg[0])
  }
  
})







let prev;
let prevdiv=document.querySelector("#card-introdiv")



