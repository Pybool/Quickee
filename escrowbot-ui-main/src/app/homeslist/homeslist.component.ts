import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit , OnDestroy, ViewChild,ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NewhomemodalComponent } from '../newhomemodal/newhomemodal.component';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { IndexDbService } from '../commonscripts/indexdbscript';
import { IDBSyncSeverService } from '../services/idb-sync-server.service';
import { abbreviateName as abbr } from '../common';
import { slugify } from '../common';

var generichomecomponentviewcontainerref:ViewContainerRef;
var vcref: ViewContainerRef
var cfr: ComponentFactoryResolver
let Target;

@Component({
  selector: 'app-homeslist',
  templateUrl: './homeslist.component.html',
  styleUrls: ['./homeslist.component.css']
})
export class HomeslistComponent implements OnInit {
    private obs$;
    public selectedHomeName
    private indexDbService;
    public metaData = {Idbname:environment.INDEX_DB_NAME}
    private homeSubscription:Subscription;
    private mode_action:string = 'create';
    public breakpoint:number;
    public kanban:boolean = false
    public colorClasses = ['bg-primary', 'bg-warning', 'bg-success', 'bg-purple', 'bg-danger', 'bg-dark'];
    public textClasses = ['text-primary', 'text-warning', 'text-success', 'text-purple', 'text-danger', 'text-dark'];
    public homes:any =[] || [{"homename":"Alagbaka home","hometag":"Hideout","description":"When i am feeling big and wanna be around very wealthy folks in quietness and serenity","image":"https://www.thekickassentrepreneur.com/wp-content/uploads/2021/12/pexels-photo-1396122.jpeg"},{"homename":"Abuja home","hometag":"Luxury","description":"This house is for official political business in Abuja ","image":"https://www.quotemaster.org/images/03/03ef9b91fdcf2636a7eb599f06b34bde.jpg"},{"homename":"Lagos home","hometag":"Flex zone","description":"This house is for my beautiful wife living in Lagos, Noisy area!!!","image":"https://2.bp.blogspot.com/-NN0eLBNXnlk/XjUntLInjpI/AAAAAAABWD0/e26lMNj8eYgH7FbeSw1fEEnayrEDPKPeQCNcBGAsYHQ/s1920/contemporary-modern-home.jpg"},{"homename":"Ijapo tech lounge","hometag":"Work zone","description":"This Facility is for coding with my colleagues from work","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Benin Lounge","hometag":"Booze zone","description":"This lounge is for Boozing and Partying with friends every friday night!!!","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Ibadan home","hometag":"Vacation crib","description":"This house is for getting away from work , yea imean a serious Vacation and Flex!!!","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Ekpene home","hometag":"Villa","description":"Similarly, changing the delimiter accordingly can help you convert strings to arrays in JavaScript. Let's look at a case where \",\" is a delimiter.","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Calabar home","hometag":"Mama's house","description":"Similarly, changing the delimiter accordingly can help you convert strings to arrays in JavaScript. Let's look at a case where \",\" is a delimiter.","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Amsterdam club house","hometag":"Club house","description":"This Facility is for sex orgies my hookers picked from night clubs in Amsterdam","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"},{"homename":"Port-Harcourt Home","hometag":"Relaxation (Yultide) spot","description":"This relaxation zone is for Christmas and new years seasons, this is where all the celebrations and Happenings take place every year end.","image":"https://www.pngmart.com/files/15/Single-Home-PNG-Image.png"}]
    public abbr = abbr
   
    @ViewChild('generichomecomponent', { read: ViewContainerRef })
    public generichomecomponentviewcontainerref!: ViewContainerRef;
    constructor(private elementRef: ElementRef,
                public vcref: ViewContainerRef,
                public cfr: ComponentFactoryResolver,
                public modalService: NgbModal,
                private router: Router,
                private homeService: HomeService,
                private IDBSyncSeverService:IDBSyncSeverService

                ) {
                  
                 }
  
    private mediaQuery(event?){
      console.log("Event ", event)
      if (event != undefined || event !=null) Target = event.target
      else Target = window
     
      if (Target.innerWidth <=765) this.breakpoint = 1;
      if (Target.innerWidth >765 && Target.innerWidth <=1204) this.breakpoint = 2;
      if (Target.innerWidth >1204 && Target.innerWidth <=1520) this.breakpoint = 3;
      if (Target.innerWidth >1520 && Target.innerWidth <=2000) this.breakpoint = 4;
      if (Target.innerWidth >2000 ) this.breakpoint = 5;
    }
  
    ngOnInit(): void {
      
      this.indexDbService = new IndexDbService({data:{},metaData:this.metaData},this.IDBSyncSeverService,this.homeService);
      this.indexDbService.readBulkSyncIDBData({tablename:'Homes',sync:false}).then((data)=>{
      this.homes = data
      if(this.homes.length > 0){
          this.homes.map(home => {
            home.color = this.colorClasses[Math.floor(Math.random() * this.colorClasses.length)];
            home.text = this.textClasses[Math.floor(Math.random() * this.textClasses.length)];
            return home;
          });
          console.log("[IDB HOMES]=====> ",data, this.homes)
      }
      else{
        /* request fresh data from api */
      }
      })
      
    }
  
    ngAfterViewInit(): void {
      
      this.obs$ = this.homeService.gethomeData()
      this.homeSubscription = this.obs$.subscribe({
        next:((val)=>{
          console.log(val)
          let fnHome = val
          this.upsert(this.homes,fnHome)
          // this.homes.push(fnHome)
        })
      })
      vcref = this.vcref
      cfr = this.cfr
      generichomecomponentviewcontainerref = this.generichomecomponentviewcontainerref
    }

    private upsert(array, element) { // (1)
      const i = array.findIndex(_element => _element.public_id === element.public_id);
      if (i > -1) array[i] = element; // (2)
      else array.push(element);
    }

  
    onResize(event) {
      this.mediaQuery(event)
      console.group("Breakpoint ===> ", this.breakpoint, window.innerWidth)
    }
  
    
    viewMode() {
      if(this.kanban){this.kanban = false}
      else{this.kanban = true}
      
    }
  
    public openModal($event:any,mode:string='') {
      console.log("Opening preferences modal...")
      const modalRef = this.modalService.open(NewhomemodalComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
          size: <any>'xl', backdrop: 'static'
        });
        
      if (mode == 'edit'){
        console.log("Event ===> ", $event.target.id)
        modalRef.componentInstance.modaldata = {mode:'edit',id:$event.target.id,header:`Editing ${$event.target.title}`};
      }
      
    }
  
   public load(){
     this.loadNewHomeComponent().then(()=>{})
   }

   public generate_otp(min, max){
        return Math.floor(Math.random() * (max-min) + min)
    }
  
   public otpAlert($event,name,pid:any){
    // let otp = this.generate_otp(1000,9999)
    // console.log("Otp ",otp, $event.target.id)
    // let pass_otp:any = prompt(`Please Enter One time password (OTP) for ${msg}`, "e.g 572690");
    // if (otp==pass_otp){
    //   console.log(`${pass_otp} confirmed, logging you in`)
    //   this.homeCardAction($event,this.mode_action)
    // }
    // else alert(`${pass_otp} is invalid, please retry`)

    this.homeCardAction($event,name,pid)
    
   }
  
   public validateUrl(mode:string,home_value:string){
      if (mode.length > 0 && home_value.length >0) return true
      else return false
   }
  
   homeCardAction($event : any, name,pid){
      var home_value;
      this.selectedHomeName = name;
      console.log(typeof $event.target.id)
      if (String($event.target?.id).length < 1) home_value = String($event.target.parentNode.id)
      else home_value = String($event.target.id)
      console.log(home_value)
      home_value = home_value.split(" ").join("");
      home_value = home_value.split("(")[0]
      console.log(home_value)
      return this.router.navigate(
        ['/smarthome/v1/home/zones-list'],
        { queryParams: { q: slugify(name),id:pid } }
      );
      // let url: string = `/home/zones-list/${mode}/${home_value}`
      // if (this.validateUrl(mode,home_value)) {
        
      // return this.router.navigateByUrl(url);
      // }
      console.log("Invalid url ")
      return false
  }
  
  deleteHome($event){
    // $event.stopPropagation();
      console.log("Deleting ",String($event.target.id).split("_delete")[0])
  }
  
    async loadNewHomeComponent(){
      vcref.clear();
      const { DynamichomecardComponent } = await import('./../dynamichomecard/dynamichomecard.component');

      console.log("Created new Home")
    }

    ngOnDestroy() {
      this.homeSubscription.unsubscribe()
      // this.connectionSubscription.unsubscribe()
  }
  
  
}

export class Linker{

  linkermethod(){
    HomeslistComponent.prototype.load()
  }
}



[
  {
      "name": "Alagbaka home (NG)",
      "tag": "Hideout",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "http://ghar360.com/blogs/wp-content/uploads/610.jpg",
      "notifications":"5"
  },
  {
      "name": "Abuja home (NG)",
      "tag": "Luxury",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://www.quotemaster.org/images/03/03ef9b91fdcf2636a7eb599f06b34bde.jpg",
      "notifications":"7"
  },
  {
      "name": "Lagos home (NG)",
      "tag": "Flex zone",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://2.bp.blogspot.com/-NN0eLBNXnlk/XjUntLInjpI/AAAAAAABWD0/e26lMNj8eYgH7FbeSw1fEEnayrEDPKPeQCNcBGAsYHQ/s1920/contemporary-modern-home.jpg",
      "notifications":"9"
  },
  {
      "name": "Ijapo tech lounge (NG)",
      "tag": "Work zone",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://architecturebeast.com/wp-content/uploads/2014/09/Most_Beautiful_Houses_In_The_World_House_M_featured_on_architecture_beast_39.jpg"
  },
  {
      "name": "Benin Lounge (NG)",
      "tag": "Booze zone",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. ",
      "image": "https://netstorage-legit.akamaized.net/images/8b3c8e4b22844907.jpg?imwidth=900",
      "notifications":"6"
  },
  {
      "name": "Ibadan home (NG)",
      "tag": "Vacation crib",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://jooinn.com/images/beautiful-house-19.jpg",
      "notifications":"13"
  },
  {
      "name": "Ekpene home (NG)",
      "tag": "Villa",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://cdn.trendir.com/wp-content/uploads/old/house-design/assets_c/2014/02/beautiful-house-courtyard-swimming-pool-1-thumb-970xauto-34265.jpg",
      "notifications":"15"
  },
  {
      "name": "Calabar home (NG)",
      "tag": "Mama's house",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://www.gannett-cdn.com/presto/2019/12/05/PNAS/8671ba5f-e918-4f32-882c-d7d3df55b706-6_Black_White_Farmhouse_Carbine__Assoc._Photo_by_Leslie_Brown.jpg?crop=4797,2699,x0,y457&width=3200&height=1801&format=pjpg&auto=webp",
      "notifications":"2"
  },
  {
      "name": "Amsterdam house (AMD)",
      "tag": "Club house",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://myhomemyzone.com/wp-content/uploads/2020/06/blh-1.png",
      "notifications":"3"
  },
  {
      "name": "Port-Harcourt Home (NG)",
      "tag": "Relaxation (Yultide) spot",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://www.homepictures.in/wp-content/uploads/2020/01/1575-Square-Feet-3-Bedroom-Contemporary-Style-Modern-Beautiful-House-Design.jpg",
      "notifications":"12"
  },
  {
      "name": "London (UK) Home",
      "tag": "Overseas Cruise",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://4.bp.blogspot.com/-uEI1uJLM2Ys/Wwf7i-Hv3rI/AAAAAAABLdk/xHF-Sx_ngp8GdIATl0Wte7WahrJP3GcsgCLcBGAs/w1200-h630-p-k-no-nu/modern-home-thumb.jpg",
      "notifications":"1"
  },
  {
      "name": "Village house (NG)",
      "tag": "Dads home",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://cutewallpaper.org/21/beautiful-house-photos/1992-square-feet-4-bedroom-beautiful-house-plan-Kerala-.jpg",
      "notifications":"6"
  },
  {
      "name": "My Office (USA)",
      "tag": "Work zone",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://wallpapercave.com/wp/wp2464243.jpg",
      "notifications":"8"
  },
  {
      "name": "Aka Etinan (NG)",
      "tag": "Sex paliative",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://i1.wp.com/theinfong.com/wp-content/uploads/2015/02/MOST-BEAUTIFUL-HOUSES-THEINFONG.COM_.jpg?resize=509%2C329",
      "notifications":"3"
  },
  {
      "name": "Shelter Afrique` (NG)",
      "tag": "Billonaires lounge",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://i.pinimg.com/originals/89/1c/f8/891cf8c797f27b8db9f7f8013a915fb2.jpg",
      "notifications":"1"
  },
  {
      "name": "Kaduna home (NG)",
      "tag": "Northern vibes",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum maximus cursus. Aliquam orci odio, viverra at venenatis sit amet, faucibus quis neque. Aliquam erat volutpat. Ut viverra felis tellus, nec vulputate quam ullamcorper eget. Mauris vestibulum justo vitae efficitur hendrerit",
      "image": "https://www.pngmart.com/files/15/Single-Home-PNG-Image.png",
      "notifications":"4"
  }
  
]
