document.querySelector("#key").value=localStorage.name;
document.querySelector("#username").value=localStorage.username;

$.ajax({
    type: "POST",
    url: "http://127.0.0.1:4000/users/blogs",
    contentType: 'application/json',
    data: JSON.stringify({
        name:localStorage.getItem("name")
    }),
    dataType: 'json',
    success: function (result) {
        console.log("hii ");
        console.log(result)
        if ("valid"== result.user) {
            console.log(result.user,"obj",result.obj);
            var arr=result.obj;
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
})
