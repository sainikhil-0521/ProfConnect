document.querySelector("#key").value=localStorage.name;
document.querySelector("#username").value=localStorage.username;

function fill(){
        storagehandle();
    var logot=document.querySelector("#logout");
        logot.addEventListener("click",()=>{
            localStorage.removeItem("name");
            storagehandle();
        })
        
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/users/blogs",
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
                  if(arr.length){
                    var blog=document.getElementById("blogs");
                    blog.innerHTML="";
                    arr.forEach((ele) => {
                        let date=moment(ele.createdAt).format("dddd, MMMM D, YYYY");
                        blog.innerHTML+=`
                        <div class="post-item">
                        <div class="post-item-inner">
                            <div class="post-thumb">
                                <img src=${ele.image} alt="blog" class="w-100">
                            </div>
                            <div class="post-content">
                                <span class="meta">By <a href="#">${ele.username}</a>  on ${date}</span>
                                <h3>${ele.title}</h3>
                                <p> ${ele.content} </p>
                            </div>
                            
                        </div>
                    </div>
                    
                    `;

                    });
                    
                
                }
            }
                        
            }
        })
}
window.onload=fill;
 window.onfocus=fill;