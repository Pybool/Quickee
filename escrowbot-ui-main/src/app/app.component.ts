import { Component ,OnInit} from '@angular/core';
import {Router} from '@angular/router'; // import router from angular router
import {MatIconModule} from '@angular/material/icon'
declare function myfunction(): any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'swiftpay';
  usersMail= ''
  usersName = ''
  constructor(private router: Router){
    
  }

  ngOnInit(){
    console.log('configured routes: ', this.router.config);
  }

  darkMode(){

  }

  abbreviateName(usersName){

  }

ngAfterViewInit() {
  
  try{
    myfunction()
  }
  catch(err:any){
    
  }
  
  
}


  reload(path:string){
    console.log("default path ", path)
    // if(path !='/Login' && path !='/Register'  && path !='/Dashboard'){
    //   console.log("Hell1 ",path+this.getpublisher())
    //   this.router.navigate([path+this.getpublisher()])
    //     .then(() => {
    //       window.location.reload();
    //     });

    // }

    // else{

      console.log("Hell2 ",path)
      this.router.navigate([path])
        .then(() => {
          window.location.reload();
        });
    // }
    
  }
}
