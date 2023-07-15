import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {

  @Input() display:any
  constructor() { }

  ngOnInit(): void {
   console.log("Communications ",this.display)
  //  if (this.display){

  //     const element = document.getElementById("overlay");
  //     if (element) {
  //       alert(1000)
  //       element.style.display = 'block';
  //     }

  //  }
    
  }

}
