// // Executes when document is loaded
// document.addEventListener("DOMContentLoaded", (ev) => {
//   // Recent Orders Data
//   document.getElementById("recent-orders--table").appendChild(buildTableBody());

//   // Updates Data
//   document
//     .getElementsByClassName("recent-updates")
//     .item(0)
//     .appendChild(buildUpdatesList());

//   // Sales Analytics
//   const salesAnalytics = document.getElementById("analytics");
//   buildSalesAnalytics(salesAnalytics);
// });

// Document Builder
// const buildTableBody = () => {
//   var recentOrderData = RECENT_ORDER_DATA;

//   var tbody = document.createElement("tbody");

//   let bodyContent = "";
//   for (let row of recentOrderData) {
//     bodyContent += `
//       <tr>
//         <td>${row.productName}</td>
//         <td>${row.productNumber}</td>
//         <td>${row.payment}</td>
//         <td class="${row.statusColor}">${row.status}</td>
//         <td class="danger">Details</td>
//       </tr>
//     `;
//   }

//   tbody.innerHTML = bodyContent;

//   return tbody;
// };

// const buildUpdatesList = () => {
//   const updateData = UPDATE_DATA;

//   const div = document.createElement("div");
//   div.classList.add("updates");

//   let updateContent = "";
//   for (const update of updateData) {
//     updateContent += `
//       <div class="update">
//         <div class="profile-photo">
//           <img src="${update.imgSrc}" />
//         </div>
//         <div class="message">
//           <p><b>${update.profileName}</b> ${update.message}</p>
//           <small class="text-muted">${update.updatedTime}</small>
//         </div>
//       </div>
//     `;
//   }

//   div.innerHTML = updateContent;

//   return div;
// };

// const buildSalesAnalytics = (element) => {
//   const salesAnalyticsData = SALES_ANALYTICS_DATA;

//   for (const analytic of salesAnalyticsData) {
//     const item = document.createElement("div");
//     item.classList.add("item");
//     item.classList.add(analytic.itemClass);

//     const itemHtml = `
//       <div class="icon">
//         <span class="material-icons-sharp"> ${analytic.icon} </span>
//       </div>
//       <div class="right">
//         <div class="info">
//           <h3>${analytic.title}</h3>
//           <small class="text-muted"> Last 24 Hours </small>
//         </div>
//         <h5 class="${analytic.colorClass}">${analytic.percentage}%</h5>
//         <h3>${analytic.sales}</h3>
//       </div>
//     `;

//     item.innerHTML = itemHtml;

//     element.appendChild(item);
//   }
// };

// Document operation functions
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Show Sidebar
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

// Hide Sidebar
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

// Change Theme
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

// document.querySelector("main").style.display="none"
$("main").css("display", "none");
$(".main1").css("display", "");

var prev_sidebar = document.querySelector(".sidebar a");

document.querySelectorAll(".sidebar a").forEach((ele) => {
  ele.addEventListener("click", (e) => {
    if (prev_sidebar != e.target) {
      console.log(e.target.classList[0]);

      document.querySelector("main." + e.target.classList[0]).style.display =
        "";
      e.target.classList.add("active");
      prev_sidebar.classList.remove("active");
      document.querySelector(
        "main." + prev_sidebar.classList[0]
      ).style.display = "none";
      prev_sidebar = e.target;
    }
  });
});


const logot2=document.querySelector(".logout");
logot2.addEventListener("click",(e)=>{
	localStorage.removeItem("name");
  localStorage.removeItem("admin");
	
	window.open("index.html","_self");
	
})

// ///mongo call

// let obj;
// let docs=await Registe#E96479UsersHR.find({_id:{$ne:'641b1f2da200c7ee16d4afa3'}},{name:1,email:1,mobile:1,_id:0})
// docs.forEach(async(ele)=>{
//   doc2=await UsersHR.findOne({_id:ele.userId});
//   ele.requestedProperties=doc2.requestedProperties.length;
//   ele.myProperties=doc2.myProperties.length;
// })
// obj.udata=docs

// docs=await Registe#E96479UsersHR.find({},{_id:0,propertyName:1,ownerName:1,propertyType:1,location:1,cost:1,bhkSize:1,RequestedUsers:1,likedUsers:1})
// docs.forEach(async(ele)=>{
//   ele.RequestedUsers=ele.RequestedUsers.length
//   ele.likedUsers=ele.likedUsers.length
// })

// obj.pdata=docs

// res.send(obj);


$.ajax({
  type: "POST",
  url: "http://127.0.0.1:4000/admin/dataDisplay",
  contentType: "application/json",
  dataType: "json",
  success: function (resp) {
    console.log(resp);
    $("#usersCount").text(resp.usersCount);
    $("#propertiesCount").text(resp.matchesCount);
    $("#requestsCount").text(resp.requestsCount);

    /*********date vs users */
   
    let xValues = [],yValues=[];
    for(let i in resp.graph0){
      xValues.push(resp.graph0[i]._id)
      yValues.push(resp.graph0[i].countDocs)
    }
      

    new Chart("mainChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{ 
        data: yValues,
        borderColor: "red",
        fill: false
      }]
    },
    options: {
      legend: {display: false},
      scales:{
        yAxes: [{
          display: true,
          ticks: {
              beginAtZero: true,
             
              
              stepSize:1
          }
        }]
      }
    }
  });

    




    /*************** */
    tbody = document.createElement("tbody");

    bodyContent = "";
    for (let row of resp.udata) {
      bodyContent += `
    <tr class="user">
      <td>${row.username}</td>
      <td>${row.email}</td>
      <td>${row.courseType}</td>
      <td>${row.userType}</td>
      <td>${row.yearsOfExperience}</td>
      <td>${row.matchedProfiles.length}</td>
    </tr>
  `;
    }

    tbody.innerHTML = bodyContent;

    document.getElementById("userData").appendChild(tbody);

    ///***** */
    tbody = document.createElement("tbody");

    bodyContent = "";
    for (let row of resp.pdata) {
      bodyContent += `
    <tr class="propertyy">
      <td>${row.profile1}</td>
      <td>${row.profile2}</td>
      <td>${row.createdOn}</td>
    </tr>
  `;
    }

    tbody.innerHTML = bodyContent;

    document.getElementById("propertyData").appendChild(tbody);

    let label1=[],data1=[],color=[]
    for(let i in resp.graph1){
      console.log(resp.graph1[i]);
      label1.push(resp.graph1[i]._id)
      data1.push(resp.graph1[i].countDocs)
      color.push("#E96479")
    }
    console.log(label1,data1)
    new Chart("myChart", {
      type: "horizontalBar",
      data: {
        labels: label1,
        datasets: [
          {
            data: data1,
            backgroundColor:color,
            label: "No Of Users",
          },
        ],
      },
      options: {
        tooltips: {
          enabled: false,
        },
        responsive: true,
        legend: {
          display: true,
          position: "bottom",
          fullWidth: true,
          labels: {
            boxWidth: 20,
            padding: 20,
          },
        },
        scales: {
          yAxes: [
            {
              barPercentage: 1,
              gridLines: {
                display: true,
                drawTicks: true,
                drawOnChartArea: false,
              },
              ticks: {
                fontColor: "#555759",
                fontFamily: "Lato",
                fontSize: 14,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: true,
                drawTicks: false,
                tickMarkLength: 5,
                drawBorder: false,
              },
              ticks: {
                padding: 5,
                beginAtZero: true,
                fontColor: "#555759",
                fontFamily: "Lato",
                fontSize: 11,
                callback: function (label, index, labels) {
                  return label / 1;
                },
              },
              scaleLabel: {
                display: true,
                padding: 10,
                fontFamily: "Lato",
                fontColor: "#555759",
                fontSize: 16,
                fontStyle: 700,
                labelString: "unit = 1",
              },
            },
          ],
        },
      },
    });

    //pie graph
    let label2=[],data2=[]
    color=[]
    for(let i in resp.graph2){
      
      label2.push(resp.graph2[i]._id)
      data2.push(Math.trunc((resp.graph2[i].countDocs/resp.usersCount)*100))
      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      color.push("#"+randomColor)
      
    }

    new Chart("myChart2", {
      type: "doughnut",
      data: {
        labels: label2,
        datasets: [
          {
            data:data2,
            backgroundColor:color,
            
          },
        ],
      },
      options: {
        legend: {
          display: true,
          position: "bottom",
          fullWidth: true,
          labels: {
            boxWidth: 20,
            padding: 20,
          },
        },
      },
    });

   

    // document.querySelector(".removeuser").addEventListener("click",(e)=>{
    //   if(confirm("Are you sure u want to remove user?")){
    //     $.ajax({
    //       type: "POST",
    //       url: "http://127.0.0.1:4000/admin/removeuser",
    //       contentType: "application/json",
    //       dataType: "json",
    //       success: function (resp) {
    //           console.log(resp);
    //       }
    //     })


    //   }
      

    // })

    // document.querySelector(".removeproperty").addEventListener("click",(e)=>{

    //   if(confirm("Are you sure u want to remove property?")){
    //     $.ajax({
    //       type: "POST",
    //       url: "http://127.0.0.1:3000/admin/removeproperty",
    //       contentType: "application/json",
    //       dataType: "json",
    //       success: function (resp) {
    //           console.log(resp);
    //       }
    //     })
    //   }
        
    // })


  },
});



function search_user() {
  let input = document.querySelector('.searchbaruser').value
  input=input.toLowerCase();
  let x = document.getElementsByClassName('user');
    
  for (i = 0; i < x.length; i++) { 
      if (x[i].children[0].innerHTML.toLowerCase().includes(input) || x[i].children[1].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display="";
        
      }
      else {
          
          x[i].style.display="none";                 
        
      }
  }
}


function search_property() {
  let input = document.querySelector('.searchbarproperty').value
  input=input.toLowerCase();
  let x = document.getElementsByClassName('propertyy');
    
  for (i = 0; i < x.length; i++) { 
      if (x[i].children[0].innerHTML.toLowerCase().includes(input) || x[i].children[2].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display="";
        
      }
      else {
          
          x[i].style.display="none";                 
        
      }
  }
}