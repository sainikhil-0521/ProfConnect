 function fill(){
    storagehandle();
    var logot=document.querySelector("#logout");
        logot.addEventListener("click",()=>{
            localStorage.removeItem("name");
            storagehandle();
        })     
        console.log("all blogs js ");
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/users/allblogs",
            contentType: 'application/json',
            headers: {
                periperi:localStorage.getItem("name")
            },
            
            success: function (result) {
                console.log("hii ");
                console.log(result)
                if ("valid"== result.user) {
                    console.log(result.user,"obj",result.obj);
                    var arr=result.obj;
                    var blog=document.getElementById("blog-wrapper");
                    blog.innerHTML="";
                    arr.forEach((ele) => {
                        let date=moment(ele.createdAt).format("MMMM D, YYYY");
                        blog.innerHTML+=`
                        <div class="post-item">
                                        <div class="post-item-inner">
                                            <div class="post-thumb">
                                                <img src=${ele.image} alt="blog">
                                            </div>
                                            <div class="post-content">
                                                <span class="meta">By <a href="#">${ele.username}</a> On ${date}</span>
                                                <h3>${ele.title}</h3>
                                                <p>${ele.content}.</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                    
                    `;

                    });
                    
                
                }

                        
            }
        })
 }
var pageCount=1;
$(".prevnext").on("click",(e)=>{
    e.preventDefault()
  console.log("all blogs js ",pageCount);
  let page;
  if($(e.target).hasClass("icofont-rounded-double-left"))
    page=pageCount-1;
  else page=pageCount+1;

  if(page<1) page=1

  pageCount=page
   console.log("pagecount",pageCount,page);
   
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/users/allblogs",
            contentType: 'application/json',
            headers: {
                periperi:localStorage.getItem("name")
            },
            data:JSON.stringify({
                page:page,
            }),
            success: function (result) {
                console.log("hii ");
                console.log(result)
                if ("valid"== result.user) {
                    console.log(result.user,"obj",result.obj);
                    var arr=result.obj;
                    if(arr.length){
                    var blog=document.getElementById("blog-wrapper");
                    blog.innerHTML="";
                    arr.forEach((ele) => {
                        let date=moment(ele.createdAt).format("MMMM D, YYYY");
                        blog.innerHTML+=`
                        <div class="post-item">
                                        <div class="post-item-inner">
                                            <div class="post-thumb">
                                                <img src=${ele.image} alt="blog">
                                            </div>
                                            <div class="post-content">
                                                <span class="meta">By <a href="#">${ele.username}</a> On ${date}</span>
                                                <h3>${ele.title}</h3>
                                                <p>${ele.content}.</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                    
                    `;

                    });
                    
                
                }else{
                    pageCount--;
                }
            }
                        
            }
        })
})

 window.onload=fill;
 