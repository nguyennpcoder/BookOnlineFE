import { Inject, Injectable } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService();
    localStorage?:Storage;

    constructor(@Inject(DOCUMENT) private document: Document){
        this.localStorage = document.defaultView?.localStorage;
    }
    //getter/setter
    getToken():string {
        return this.localStorage?.getItem(this.TOKEN_KEY) ?? '';
    }
    // setToken(token: string): void {        
    //     this.localStorage?.setItem(this.TOKEN_KEY, token);             
    // }
    getUserId(): number {
        let token = this.getToken();
        if (!token) {
            return 0;
        }
        let userObject = this.jwtHelperService.decodeToken(token);
        return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
    }
    
      
    removeToken(): void {
        this.localStorage?.removeItem(this.TOKEN_KEY);
    }      
            
    isTokenExpired(): boolean { 
        if(this.getToken() == null) {
            return false;
        }       
        return this.jwtHelperService.isTokenExpired(this.getToken()!);
    }

    setToken(token: string): void {        
        this.localStorage?.setItem(this.TOKEN_KEY, token);             
        // Decode the token and store the userId separately
        let userObject = this.jwtHelperService.decodeToken(token);
        if ('userId' in userObject) {
            this.localStorage?.setItem('userId', String(userObject['userId']));
        }
    }
    getUserIdFromLocalStorage(): number {
        const userString = this.localStorage?.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          return user.id;
        }
        return 0; // Return default value or handle appropriately
      }
    
    
}
