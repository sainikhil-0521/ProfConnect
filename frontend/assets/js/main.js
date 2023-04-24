
function fill(){
    storagehandle();
        var logot=document.querySelector("#logout");
                logot.addEventListener("click",()=>{
                    localStorage.removeItem("name");
                    storagehandle();
                })
                
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:4000/users/adminblogs",
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
                    console.log(arr);
                    var blog=document.getElementById("blogContainer");
                    blog.innerHTML=`
                <div class="section-header">
                    
                    <h2>Admin Blogs </h2>
                </div>
                <div class="section-wrapper">
                    <div class="row justify-content-center g-4" id="adminblogs">
                    </div>
                </div>
                    `;
                    blogsad=document.getElementById("adminblogs")
                    arr.forEach((ele) => {
                    // let date=moment(ele.createdAt).format("dddd, MMMM D, YYYY");
                        blogsad.innerHTML+=`
                        
                                <div class="col-lg-4 col-md-6 col-12">
                                        <div class="story-item lab-item">
                                            <div class="lab-inner">
                                                <div class="lab-thumb">
                                                    <img src=${ele.image} alt="img" style="width:356px;height:190px;">
                                                </div> 
                                                <div class="lab-content">
                                                    <h4>${ele.title}</h4>
                                                
                                                    <a href="blog.html" class="lab-btn"><i class="icofont-circled-right"></i>
                                                        Read More</a>
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>
                            
                    
                    `;

                    });
                    
                
                }

                        
            }
        })
}

window.onload=fill;
window.onfocus=fill;