import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public data:any = {service:0,api_provider:0,service_provider:0}
  public pricelists:any = [];
  public metadata:any = [];
  public service_providers:any = [];
  public key:string;

  constructor(private adminservice : AdminService,) { 
    this.adminservice.admin_pricelist_metadata().subscribe(
      (response)=>{
          if(response.status){this.metadata = response}
        });
  }

  ngOnInit(): void {
    this.adminservice.admin_pricelist(this.data).subscribe(
      (response)=>{
          if(response.status){this.pricelists = response.data}
      });
  }

  public onChange(e:any){
    const target = e.target as HTMLSelectElement;
    this.adminservice.admin_pricelist_metadata().subscribe({
      next:(response:any) => {
        if(response.status){
          this.metadata = response
          console.log(response)
          if (target.value == 'data'){
            this.key = 'isp_name'
            this.service_providers = response.network_providers
          }
          else if (target.value == 'cable'){
            this.key = 'cabletv_name'
            this.service_providers = response.cable_providers
          }
          else if (target.value == 'electricity'){
            this.key = 'disco_name'
            this.service_providers = response.discos
          }
        }
      },
      error:(err: { error: { msg: string; }; }) => {}
    });
  }

  public onChangeTable(e:any){
    const sel_api_provider = document.getElementById('api_provider') as HTMLSelectElement | null;
    const sel_service_type = document.getElementById('service_type') as HTMLSelectElement | null;
    const sel_service_provider = document.getElementById('service_provider') as HTMLSelectElement | null;
    this.data = {service:sel_service_type?.value,api_provider:sel_api_provider?.value,service_provider:parseInt(sel_service_provider?.value)}
    this.adminservice.admin_pricelist(this.data).subscribe(
      (response)=>{
          if(response.status){this.pricelists = response.data}
      });
  }
  

}
