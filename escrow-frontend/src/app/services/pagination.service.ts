import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PaginationService {
  private currentPage = 1;
  private totalPages = 1;
  private firstLink:any;
  private lastLink:any;
  private query:string = '';
  private links$:any = new BehaviorSubject<any>({});
  private resetPaginator$:any = new BehaviorSubject<boolean>(false);
  activecmp:string = '';
  dataEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  setLinks(first:any,last:any,cmp:string,query='',is_search=false){
    // this.resetPaginator$.next(true)
    this.activecmp = cmp
    this.firstLink = first
    this.lastLink = last
    if (query.trim() != ''){
      this.query = query
    }
    this.links$.next({links:this.generateLinks(is_search)}) 
  }

  resetPaginator(){
    this.links$.next({links:[]}) 
  }

  getResetPaginator(){
    return this.resetPaginator$.asObservable()
  }

  getActiveCmp(){
    return this.activecmp
  }

  generateLinks$() {
    return this.links$.asObservable()
  }

  generateLinks(is_search:boolean,perpage=environment.paginationLimit) {
    let links: Array<any> = [];
    const firstLinkPageNumber = 1//this.getPageNumberFromLink(this.firstLink);
    const lastLinkPageNumber = this.getPageNumberFromLink(this.lastLink,perpage)

    this.totalPages =  lastLinkPageNumber;
    //Initialize this.query if we are not searching
    if(!is_search){
      this.query = ''
    }

    for (let i = firstLinkPageNumber; i <= lastLinkPageNumber; i++) {
      links.push({ page: i, link: this.generateLink(i), cmp:this.activecmp , query:this.query});
    }

    return links;
  }

  private generateLink(pageNumber: number) {
    return pageNumber
  }

  private getPageNumberFromLink(url:any,perpage:any) {
    if(url){
      
      const urlSearchParams:any = new URLSearchParams(new URL(url).search);
      return parseInt(urlSearchParams.get("offset") ||   (parseInt(urlSearchParams.get("page"))*perpage).toString() );
    }
    else{
      return 1
    }
    
  }

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.totalPages;
  }
}



