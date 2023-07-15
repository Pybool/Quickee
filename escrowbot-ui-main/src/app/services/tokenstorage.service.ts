import { Injectable } from '@angular/core';

const MAIL = "MAIL";
const PHONE = "PHONE";
const TOKEN = "TOKEN";
const USERID = "USERID";
const USERNAME = "USERNAME";
const SETTINGS = "SETTINGS";

@Injectable({
  providedIn: 'root'
})
export class TokenstorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveState(state: any): void {
    window.sessionStorage.removeItem("_st");
    window.sessionStorage.setItem("_st", state);
  }

  public getState(): string | null {
    let state:any = window.sessionStorage.getItem("_st")
    return JSON.parse(state);
  }

  public saveHistory(history:any){
    window.sessionStorage.setItem("_hst", JSON.stringify(history))
  }

  public getHistory(): string | null {
    let _hst:any = window.sessionStorage.getItem("_hst")
    return JSON.parse(_hst);
  }

  public clearState(): string | null {
    let reset_status:any = window.sessionStorage.removeItem("_st")
    return reset_status
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.setItem(TOKEN, token);
  }

  public savePhone(phone: string): void {
    window.sessionStorage.removeItem(PHONE);
    window.sessionStorage.setItem(PHONE, phone);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN);
  }

  public saveUserid(userID: any): void {
    window.sessionStorage.removeItem(USERID);
    window.sessionStorage.setItem(USERID,userID);
  }

  public saveUsername(username: any): void {
    window.sessionStorage.removeItem(USERNAME);
    window.sessionStorage.setItem(USERNAME, JSON.stringify(username));
  }

  public saveMail(mail: any): void {
    window.sessionStorage.removeItem(MAIL);
    window.sessionStorage.setItem(MAIL, JSON.stringify(mail));
  }

  
  public saveUserSettings(settings: any): void {
    window.sessionStorage.removeItem(SETTINGS);
    window.sessionStorage.setItem(SETTINGS, JSON.stringify(settings));
  }

  public getUser(): any {
    const user = JSON.stringify(window.sessionStorage.getItem(USERID));
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getUsername(): any {
    const username = JSON.stringify(window.sessionStorage.getItem(USERNAME));
    if (username) {
      return JSON.parse(username);
    }

    return {};
  }

  public getMail(): string | null {
    const mail = JSON.stringify(window.sessionStorage.getItem(MAIL));
    if (mail) {
      return JSON.parse(mail);
    }

    return null;
  }

  public getPhone(): string | null {
    const phone = JSON.stringify(window.sessionStorage.getItem(PHONE));
    if (phone) {
      return JSON.parse(phone);
    }

    return null;
  }


}
