import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admindocumentation',
  templateUrl: './admindocumentation.component.html',
  styleUrls: ['./admindocumentation.component.css']
})
export class AdminDocumentationComponent implements OnInit {
  userAuthenticated$:Observable<boolean>;;
  constructor() { 
    
    
  }

  ngOnInit(): void {
    window.localStorage.setItem("online",'offline')
  }

  
  


 

}
