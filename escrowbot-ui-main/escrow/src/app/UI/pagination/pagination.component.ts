import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { take } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { UserService } from 'src/app/services/user.service';
// import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  links: Array<any> = [];
  currentPage: number = 1;
  totalPages: number = 0;
  displayedPages:any
  showLoadMoreButton:boolean = true
  activateLessButton:boolean = false
  firstrun = true
  cap = 2000
  isCallable = true
  blocks = this.generateMultiplesOfThree(0,400)

  @Output() dataEvent = new EventEmitter<string>();

  constructor(private paginationService: PaginationService,
    private elRef: ElementRef, private renderer: Renderer2,
    private orderService: OrderService
 
    ) {

  }


  generateMultiplesOfThree(start = 0, stop = 0, chunk = 400) {
    if (stop > start) {
      chunk = stop - start;
    }
    const len = Math.round(chunk / 3);
    const numbers = new Array(len);
    for (let i = 0; i < len; i++) {
      numbers[i] = (i * 3) + start;
    }
    return numbers;
  }

  ngOnInit() {


    this.paginationService.generateLinks$().subscribe((response:any)=>{
      console.log("=======================",response)
      this.links = response.links
      try{
        this.displayedPages = this.links.slice(0,5)
      console.log(this.links)
      this.currentPage = this.paginationService.getCurrentPage();
      this.totalPages = this.paginationService.getTotalPages();
      }
      catch{}
    });
    // this.originalLinks = this.links
    
  }

  // ngAfterViewInit() {
  //   this.scrollContainer = this.elRef.nativeElement.querySelector('.scroll-container');
  // }

  onScroll(event:any) {
    const element = event.target;
    if ((Math.round(element.scrollHeight - element.scrollTop) - element.clientHeight) < 2) { // This works for exact precision Math.round(element.scrollHeight - element.scrollTop) === element.clientHeight
      this.loadMoreItems();
    }
  }

  getSiblings = (node: any) => [...node.parentNode.children].filter(c => c !== node)

  private sendPaginationData(data:any){
    this.dataEvent.emit(data)
  }


  nextPage($event:any,link:any,cmp:string){
    console.log(link,cmp)

    const services:any = {'buyer-orders':{$:this.orderService.nextPage(parseInt(link),cmp)},
                          'seller-orders':{$:this.orderService.nextPage(parseInt(link),cmp)}}
                    
                   
      services[cmp].$.subscribe((response:any)=>{
        console.log("Pagination response -----> ", response)
        try{
          this.sendPaginationData(response)
        }
        catch(err){alert(err)}
        const e = $event.target

        let links = this.getSiblings(e.parentElement)
        console.log(links)
        links.forEach((link)=>{
          link.classList.remove('active')
        })

        $event.target.parentElement.classList.add('active')
      })
    
  }

  loadMoreItems() {
    // call your function here to load more items
    if(this.isCallable){
      console.log('Loading more items...');
    const last = this.blocks[this.blocks.length - 1]
    if(last+403 < this.cap){
      console.log(last, last + 403)
      console.log(this.generateMultiplesOfThree(last+3,last+3 + 400))
      this.blocks =this.blocks.concat(this.generateMultiplesOfThree(last+3,last+3 + 400))
      console.log(this.blocks)
    }
    else{ //not working
      this.blocks =this.blocks.concat(this.generateMultiplesOfThree(last+3,last+3 + this.cap-last))
      this.blocks = this.removeElementsAfter(this.blocks,this.cap)
      console.log(this.blocks)
      this.isCallable = false
    }
    }
  }

  removeElementsAfter(array:any, element:any) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index + 1);
    }
    return array;
  }

  setPage(pageNumber: number) {
    this.paginationService.setPage(pageNumber);
    this.currentPage = this.paginationService.getCurrentPage();
  }

  loadMorePages() {
      const start = this.displayedPages.length;
      const end = start + 5;
      
      let newLinks = []
    if(!this.firstrun){
      this.currentPage += 5;
    }
    else{
      this.currentPage += 10;
    }
      
      for(let i=this.currentPage-6; i< this.currentPage-1; i++){
        newLinks.push({page:i+1,link:i+1,cmp:this.paginationService.getActiveCmp()})
      }
      [...this.links.splice(5,0, ...newLinks)]
      this.links.splice(0,5)
      console.log(this.currentPage)
      this.showLoadMoreButton = this.currentPage < this.totalPages;
      this.activateLessButton = true
    
    this.firstrun = false
    
  }

  backTrackPages() {
    
    let newLinks = []
  if(!this.firstrun){
    this.currentPage -= 5;
    for(let i=this.currentPage-5; i< this.currentPage; i++){
      newLinks.push({page:i,link:i,cmp:this.paginationService.getActiveCmp()})
    }
    console.log(...this.links.splice(5,0, ...newLinks))
    this.links.splice(0,5)
    this.showLoadMoreButton = this.currentPage < this.totalPages;
    this.activateLessButton = this.currentPage -5 > 1
  }
  this.firstrun = false
  
}
}
