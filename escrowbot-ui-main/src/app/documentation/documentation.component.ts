import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  userAuthenticated$:Observable<boolean>;;
  constructor() {  }

  ngOnInit(): void {
    window.localStorage.setItem("online",'offline')
  }

}
