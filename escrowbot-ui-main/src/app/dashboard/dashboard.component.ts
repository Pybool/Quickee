import { TokenstorageService } from './../services/tokenstorage.service';
import { DashboardService } from './../services/dashboard.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { EkoModalComponent } from '../eko-modal/eko-modal.component';
import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

var pad = [
  {
      "date": "2022-03-30",
      "total": 4700
  },
  {
      "date": "2023-11-10",
      "total": 21200
  },
  {
      "date": "2023-11-11",
      "total": 28200
  },
  {
      "date": "2023-11-12",
      "total": 2000
  },
  {
      "date": "2023-11-13",
      "total": 7500
  },
  {
      "date": "2023-11-14",
      "total": 12000
  },
  {
      "date": "2023-11-15",
      "total": 4000
  },
  {
    "date": "2023-04-30",
    "total": 4700
},
{
    "date": "2023-12-10",
    "total": 21200
},
{
    "date": "2023-12-12",
    "total": 28200
},
{
    "date": "2023-12-12",
    "total": 2000
},
{
    "date": "2023-12-13",
    "total": 7500
},
{
    "date": "2023-12-14",
    "total": 12000
},
{
    "date": "2023-12-15",
    "total": 4000
}
]
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public uid:string;
  public chunk_size = 15;
  public timeframe = 365;
  public username:string;
  public Object:any = Object();
  public DashboardMetrics:any;
  public AirtimeMetrics:any = 0;
  public CableMetrics:any = 0;
  public DataMetrics:any = {volume:0,totalamount:0}
  public ElectricityMetrics:any = {units:0,totalamount:0}
  public totalpurchaseamount:any = 0;
  public RecentTransactions:any[];
  public airtimechartdata:any[];
  public datasubchartdata:any[];
  public cablechartdata:any[];
  public electricitysubchartdata:any[];
  constructor(private tokenstorageservice: TokenstorageService, private dashboardservice: DashboardService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.uid = this.tokenstorageservice.getUser()
    this.username = JSON.parse(this.tokenstorageservice.getUsername())
    this.getDashboardMetrics()
  
  }

  private plotGraph(chartData) {
    // this.uid = this.tokenstorageservice.getUser()
          // Create chart instance
          
      const colors = [ "#007bff", "#6610f2","#6f42c1","#e83e8c","dc3545",
                        "#fd7e14","#ffc107","#28a745","#20c997","#17a2b8","#6c757d","#343a40",
                        "#007bff","#6c757d","#28a745","#17a2b8","#ffc107","#dc3545","#f8f9fa", "#343a40"
                      ]
     
      // Create root and chart
      let root = am5.Root.new("chartdiv");
      let chart = root.container.children.push( 
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        }) 
      );

      let root1 = am5.Root.new("chartdiv1");
      let chart1 = root1.container.children.push( 
        am5xy.XYChart.new(root1, {
          panY: false,
          layout: root1.verticalLayout
        }) 
      );

      let root2 = am5.Root.new("chartdiv2");
      let chart2 = root2.container.children.push( 
        am5xy.XYChart.new(root2, {
          panY: false,
          layout: root2.verticalLayout
        }) 
      );

      let root3 = am5.Root.new("chartdiv3");
      let chart3 = root3.container.children.push( 
        am5xy.XYChart.new(root3, {
          panY: false,
          layout: root3.verticalLayout
        }) 
      );

      // Add data
      this.airtimechartdata = chartData?.airtime
      this.datasubchartdata = chartData?.data
      this.cablechartdata = chartData?.cable
      this.electricitysubchartdata = chartData?.electricity

      pad.forEach((data)=>{ //remove
        this.airtimechartdata.push(data)
      })
      pad.forEach((data)=>{
        this.datasubchartdata.push(data)
      })
      pad.forEach((data)=>{
        this.cablechartdata.push(data)
      })
      pad.forEach((data)=>{
        this.electricitysubchartdata.push(data)
      })

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      var cursor1 = chart1.set("cursor", am5xy.XYCursor.new(root1, {}));
      cursor1.lineY.set("visible", false);

      var cursor2 = chart2.set("cursor", am5xy.XYCursor.new(root2, {}));
      cursor2.lineY.set("visible", false);

      var cursor3 = chart3.set("cursor", am5xy.XYCursor.new(root3, {}));
      cursor3.lineY.set("visible", false);
      
      
      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      var xRenderer1 = am5xy.AxisRendererX.new(root1, { minGridDistance: 30 });
      xRenderer1.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      var xRenderer2 = am5xy.AxisRendererX.new(root2, { minGridDistance: 30 });
      xRenderer2.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      var xRenderer3 = am5xy.AxisRendererX.new(root3, { minGridDistance: 30 });
      xRenderer3.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });
      
      var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      var xAxis1 = chart1.xAxes.push(am5xy.CategoryAxis.new(root1, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer1,
        tooltip: am5.Tooltip.new(root1, {})
      }));

      var xAxis2 = chart2.xAxes.push(am5xy.CategoryAxis.new(root2, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer2,
        tooltip: am5.Tooltip.new(root2, {})
      }));

      var xAxis3 = chart3.xAxes.push(am5xy.CategoryAxis.new(root3, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer3,
        tooltip: am5.Tooltip.new(root3, {})
      }));
      
      var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {})
      }));

      var yAxis1 = chart1.yAxes.push(am5xy.ValueAxis.new(root1, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root1, {})
      }));

      var yAxis2 = chart2.yAxes.push(am5xy.ValueAxis.new(root2, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root2, {})
      }));

      var yAxis3 = chart3.yAxes.push(am5xy.ValueAxis.new(root3, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root3, {})
      }));

      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText:"{valueY}"
        })
      }));

      var series1 = chart1.series.push(am5xy.ColumnSeries.new(root1, {
        name: "Series 2",
        xAxis: xAxis1,
        yAxis: yAxis1,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root1, {
          labelText:"{valueY}"
        })
      }));

      var series2 = chart2.series.push(am5xy.ColumnSeries.new(root2, {
        name: "Series 3",
        xAxis: xAxis2,
        yAxis: yAxis2,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root2, {
          labelText:"{valueY}"
        })
      }));

      var series3 = chart3.series.push(am5xy.ColumnSeries.new(root3, {
        name: "Series 4",
        xAxis: xAxis3,
        yAxis: yAxis3,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root3, {
          labelText:"{valueY}"
        })
      }));

      
      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      series.columns.template.adapters.add("fill", function(fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series1.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      series1.columns.template.adapters.add("fill", function(fill, target) {
        return chart1.get("colors").getIndex(series1.columns.indexOf(target));
      });

      series2.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      series2.columns.template.adapters.add("fill", function(fill, target) {
        return chart2.get("colors").getIndex(series2.columns.indexOf(target));
      });

      series3.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      series3.columns.template.adapters.add("fill", function(fill, target) {
        return chart3.get("colors").getIndex(series3.columns.indexOf(target));
      });
      
      series.columns.template.adapters.add("stroke", function(stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series1.columns.template.adapters.add("stroke", function(stroke, target) {
        return chart1.get("colors").getIndex(series1.columns.indexOf(target));
      });

      series2.columns.template.adapters.add("stroke", function(stroke, target) {
        return chart2.get("colors").getIndex(series2.columns.indexOf(target));
      });

      series3.columns.template.adapters.add("stroke", function(stroke, target) {
        return chart3.get("colors").getIndex(series3.columns.indexOf(target));
      });

      var data = this.airtimechartdata;
      var datasub_data = this.datasubchartdata;
      var cabledata = this.cablechartdata;
      var electricitysub_data = this.electricitysubchartdata;
      console.log("Barchart data ",data)
      xAxis.data.setAll(data);
      series.data.setAll(data);

      xAxis1.data.setAll(datasub_data);
      series1.data.setAll(datasub_data);

      xAxis2.data.setAll(cabledata);
      series2.data.setAll(cabledata);

      xAxis3.data.setAll(electricitysub_data);
      series3.data.setAll(electricitysub_data);
      
      
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);

      series1.appear(1000);
      chart1.appear(1000, 100);

      series2.appear(1000);
      chart2.appear(1000, 100);

      series3.appear(1000);
      chart3.appear(1000, 100);

      //Events handling to split each axes
      xAxis.get("renderer").labels.template.setup = function(target) {
        target.set("background", am5.Rectangle.new(root, {
          fill: am5.color(0xff0000),
          fillOpacity: 0
        }))
      }

      xAxis1.get("renderer").labels.template.setup = function(target) {
        target.set("background", am5.Rectangle.new(root1, {
          fill: am5.color(0xff0000),
          fillOpacity: 0
        }))
      }

      xAxis2.get("renderer").labels.template.setup = function(target) {
        target.set("background", am5.Rectangle.new(root2, {
          fill: am5.color(0xff0000),
          fillOpacity: 0
        }))
      }

      xAxis3.get("renderer").labels.template.setup = function(target) {
        target.set("background", am5.Rectangle.new(root3, {
          fill: am5.color(0xff0000),
          fillOpacity: 0
        }))
      }


      
  }

  private getRecentTransactions():any{
    
      this.dashboardservice.getRecentTransactions(this.uid,this.chunk_size).subscribe((response: any) => {
          // response = JSON.parse(response)
          let pending_orders:string[] = []
          let data = response.data
          console.log("Recent transactions list ",data, typeof data)
          this.RecentTransactions = data
        
      })
  }

  private getDashboardMetrics():any{
    
    this.dashboardservice.getDashboardMetrics(this.uid,this.timeframe).subscribe((response: any) => {
        // response = JSON.parse(response)
        let data = response
        console.log("Dashboard metrics data ",data)
        data = data.metrics_data
        this.parseMetrics(data)
        this.getRecentTransactions()
        let obj = {}
        var services = ['airtime','data','cable','electricity']
        for (let i=0; i < services.length; i++){
          var retdata = this.parseServiceData(data[i][services[i]][1])
          obj[services[i]] = retdata
        }
        console.log("All graph data ",obj)
        this.plotGraph(obj)
       
      
    })
}

  private parseMetrics(data):any{
    for (let i=0; i < data.length; i++){
        if (Object.keys(data[i])[0] == 'airtime'){
          this.AirtimeMetrics = data[i].airtime[0]
          console.log("Airtime metrics ", this.AirtimeMetrics)
          
          
        }
        if (Object.keys(data[i])[0] == 'cable'){
          this.CableMetrics = data[i].cable[0]
        }
        if (Object.keys(data[i])[0] == 'data'){
          let datalen = data[i].data[1].length
          let summation = []
          for (let j = 0; j < datalen; j++){
            console.log("Data metrics parser ", parseFloat(String(data[i].data[1][j].plan).split('GB')[0]))
            summation.push(parseFloat(String(data[i].data[1][j].plan).split('GB')[0]))
          }
    
          // Getting sum of list
          var gbsum = summation.reduce(function(a, b){
              return a + b;
          }, 0);
          console.log("The GB bought ",gbsum)
          this.DataMetrics['volume'] = gbsum
          this.DataMetrics['totalamount'] = data[i].data[0];
          
        }

        if (Object.keys(data[i])[0] == 'electricity'){
          let electricitylen = data[i].electricity[1].length
          let summation = []
          for (let j = 0; j < electricitylen; j++){
            console.log("Electricity metrics parser ", parseFloat(String(data[i].electricity[1][j].units).split('kwH')[0]))
            summation.push(parseFloat(String(data[i].electricity[1][j].units).split('kwH')[0]))
          }
    
          // Getting sum of list
          var kwsum = summation.reduce(function(a, b){
              return a + b;
          }, 0);
          console.log("The Kilowatts bought ",kwsum)
          this.ElectricityMetrics['units'] = kwsum
          this.ElectricityMetrics['totalamount'] = data[i].electricity[0];
          
        }
        
        
    }
    this.totalpurchaseamount = parseFloat(this.AirtimeMetrics) + parseFloat(this.CableMetrics) + parseFloat(this.DataMetrics.totalamount) + parseFloat(this.ElectricityMetrics.totalamount)
  }

  private plotGraphData(data:any){
    console.log("Graph data ",data[0].airtime[1])
    let airtimeSum:any = []
    for(let airtimedata of data){
      
    }
  }

  private parseServiceData(serviceData){
    let date_array = []
    for(let servicedata of serviceData){
        var date = servicedata['date_time'].split('--')[0]
        date_array.push(date)
        
    }
    var chartdata = []
    for (let date of Array.from(new Set(date_array))){
        var result = serviceData.filter(obj => {
            return obj['date_time'].includes(date)
        })
        result.reduce((total, obj) => obj.amount + total,0)
        var obj = {}
        obj['date'] = date
        obj['total'] = result.reduce((total, obj) => obj.amount + total,0)
        chartdata.push(obj)
    }
    return chartdata
}


  public graph = {
    data: [
        { x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], y: [2, 6, 3, 5, 7, 6, 8, 4, 6, 20], type: 'scatter', mode: 'lines+points', marker: {color: 'orange'}},
    ],
    layout: {width: 780, height: 345, title: {text:'Airtime metrics',x: 0,y: 1.2,xanchor: 'left',yanchor: 'bottom'},
    font: {
      family: 'Times New Roman, times',
      size: 18,
      
    },
    showlegend: false,displayModeBar: false },
    
    
};

public graph_ = {
  data: [
      { x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], y: [2, 6, 3, 5, 7, 6, 8, 4, 6, 20], type: 'scatter', mode: 'lines+points', marker: {color: 'steelblue'}},
  ],
  layout: {width: 780, height: 345, title: {text:'Data metrics',x: 0,y: 1.2,xanchor: 'left',yanchor: 'bottom'},
  font: {
    family: 'Times New Roman, times',
    size: 18,
    
  },
  showlegend: false,displayModeBar: false 

},
  
  
};


openModal() {
  console.log("Opening preferences modal...")
  const modalRef = this.modalService.open(EkoModalComponent,
    {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      size: 'lg', backdrop: 'static'
    });
  modalRef.result.then((result:any) => {
    console.log("Modal result ",result);
  }, (reason:any) => {
  });
}

}

function removeTag(self,process_code,id){
  self.parentNode.remove()
}


