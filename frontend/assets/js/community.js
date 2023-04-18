$(".group-count").click((e)=>{
    window.open("../chat/chat.html","_self")
})

$.ajax({
    type: "GET",
    url: "http://127.0.0.1:4000/algo/getMatches?user="+,
    headers:{
        periperi:localStorage.token
    },
    contentType: "application/json",
    dataType: "json",
    success: function (resp) {

    },
    error: function (e){

    }
})