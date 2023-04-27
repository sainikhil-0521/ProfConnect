$.ajax({
    type: "POST",
    url: "http://127.0.0.1:4000/users/userType",
    headers: {
      periperi: localStorage.name,
    },
    contentType: 'application/json',
    success:function (resp) {
        if(resp!=="notok"){

            
            console.log(resp);
            resp.ends=new Date(resp.ends)
            if(resp.type!=="free"){
                $(".purchase-btn").hide()
                
                $("."+resp.type).html(`<h6>Your Plan Expiry Date</h6>
                <h2>${resp.ends.getUTCDate()+"-"+(resp.ends.getUTCMonth()+1)+"-"+resp.ends.getUTCFullYear()}</h2>`)
                    
            }
            
        }
        else{
            window.open("404.html","_self")
        }
    }
})

$(".purchase-btn").click((e)=>{
    let type=($(e.target).hasClass("silverbtn")?"silver":"gold")
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:4000/users/userTypeChange",
        headers: {
          periperi: localStorage.name,
        },
        data: JSON.stringify({
            type:type
          }),

        contentType: 'application/json',
        success:function (resp) {
            if(resp!=="notok"){
                    console.log("cool");
            }
            location.reload()
        }
    })
    
})

