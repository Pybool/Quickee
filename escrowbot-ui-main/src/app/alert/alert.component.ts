import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  public message:string 
  constructor() { 
    
   }

  ngOnInit(): void {
   
    // this.showalert("Glo data subscription of 20GB was successful")
  }

  public async showalert(message:string): Promise<void> {
    this.message = message
    console.log("Messages ",this.message)
    $("#message").text(message)
    $("#check").prop("checked", true)
   
    setTimeout(function(){ 
      $("#check").prop("checked", false).fadeIn();}, 2000); 


  }

  

}
