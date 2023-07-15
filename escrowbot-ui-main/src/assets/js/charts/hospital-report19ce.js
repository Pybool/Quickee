"use strict";!function(NioApp,$){var ipdIncome={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"rgb(51 51 134)",background:"transparent",data:[920,1005,1250,850,1100,1006,1310,1050,1100,1310,1050,1100]}]},opdIncome={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#816bff",background:"transparent",data:[920,1050,1250,850,1100,1006,1310,1050,1100,1310,1050,1100]}]},labIncome={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#ffa353",background:"transparent",data:[920,1050,1250,850,1100,1060,1310,1050,1100,1310,1050,1100]}]},otIncome={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#ff63a5",background:"transparent",data:[920,1050,1250,850,1100,1060,1310,1050,1100,1310,1050,1100]}]},electricity={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#e85347",background:"transparent",data:[920,1005,1250,850,1100,1006,1310,1050,1100,1310,1050,1100]}]},equipements={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#f4bd0e",background:"transparent",data:[920,1050,1250,850,1100,1006,1310,1050,1100,1310,1050,1100]}]},maintenance={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#2c3782",background:"transparent",data:[920,1050,1250,850,1100,1060,1310,1050,1100,1310,1050,1100]}]},rents={labels:["12AM - 02AM","02AM - 04AM","04AM - 06AM","06AM - 08AM","08AM - 10AM","10AM - 12PM","12PM - 02PM","02PM - 04PM","04PM - 06PM","06PM - 08PM","08PM - 10PM","10PM - 12PM"],dataUnit:"USD",lineTension:.3,datasets:[{label:"USD",color:"#1c2b46",background:"transparent",data:[920,1050,1250,850,1100,1060,1310,1050,1100,1310,1050,1100]}]};function ecommerceLineS3(selector,set_data){var $selector=$(selector||".ecommerce-line-chart-s3");$selector.each(function(){for(var $self=$(this),_self_id=$self.attr("id"),_get_data=void 0===set_data?eval(_self_id):set_data,selectCanvas=document.getElementById(_self_id).getContext("2d"),chart_data=[],i=0;i<_get_data.datasets.length;i++)chart_data.push({label:_get_data.datasets[i].label,tension:_get_data.lineTension,backgroundColor:_get_data.datasets[i].background,borderWidth:2,borderColor:_get_data.datasets[i].color,pointBorderColor:"transparent",pointBackgroundColor:"transparent",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:_get_data.datasets[i].color,pointBorderWidth:2,pointHoverRadius:4,pointHoverBorderWidth:2,pointRadius:4,pointHitRadius:4,data:_get_data.datasets[i].data});var chart=new Chart(selectCanvas,{type:"line",data:{labels:_get_data.labels,datasets:chart_data},options:{legend:{display:_get_data.legend||!1,rtl:NioApp.State.isRTL,labels:{boxWidth:12,padding:20,fontColor:"#6783b8"}},maintainAspectRatio:!1,tooltips:{enabled:!0,rtl:NioApp.State.isRTL,callbacks:{title:function(a,t){return!1},label:function(a,t){return t.datasets[a.datasetIndex].data[a.index]+" "+_get_data.dataUnit}},backgroundColor:"#1c2b46",titleFontSize:8,titleFontColor:"#fff",titleMarginBottom:4,bodyFontColor:"#fff",bodyFontSize:8,bodySpacing:4,yPadding:6,xPadding:6,footerMarginTop:0,displayColors:!1},scales:{yAxes:[{display:!1,ticks:{beginAtZero:!1,fontSize:12,fontColor:"#9eaecf",padding:0},gridLines:{color:NioApp.hexRGB("#526484",.2),tickMarkLength:0,zeroLineColor:NioApp.hexRGB("#526484",.2)}}],xAxes:[{display:!1,ticks:{fontSize:12,fontColor:"#9eaecf",source:"auto",padding:0,reverse:NioApp.State.isRTL},gridLines:{color:"transparent",tickMarkLength:0,zeroLineColor:NioApp.hexRGB("#526484",.2),offsetGridLines:!0}}]}}})})}NioApp.coms.docReady.push(function(){ecommerceLineS3()})}(NioApp,jQuery);