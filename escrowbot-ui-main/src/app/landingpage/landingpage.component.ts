import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  userAuthenticated$:Observable<boolean>;;
  constructor() { 
    
    
  }

  ngOnInit(): void {
    window.localStorage.setItem("online",'offline')
  }
  


 

}
