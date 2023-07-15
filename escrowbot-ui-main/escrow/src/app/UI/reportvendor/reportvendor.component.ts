import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-reportvendor',
  templateUrl: './reportvendor.component.html',
  styleUrls: ['./reportvendor.component.css']
})
export class ReportvendorComponent {
  user:any = {}
  order_public_id:any;

  constructor(private route: ActivatedRoute, private orderService: OrderService){
    
  }

  ngAfterViewInit(){
    this.route.queryParams
      .subscribe(params => {
        this.order_public_id = params['orderId'];
        console.log(this.order_public_id); // price
      }
    );
  }

  reportVendor(){
    const payload = { complaint:this.user.complaint,
                      order_public_id:this.order_public_id
                    }
    this.orderService.reportOnOrder(payload).subscribe((response)=>{
      if(response.status){
        const btn:any = document.getElementById(this.order_public_id)
        btn.innerHTML = 'Reported'
        // btn.style.color = 'red'
      }
      alert(response.message)
    })
  }
}
