import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { UserResponse } from '../responses/user/user.response';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { HttpUtilService } from './http.util.service';
import { DOCUMENT } from '@angular/common';
import { Role } from '../models/role';
 import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // blockOrEnableUser(id: number, arg1: boolean) {
  //   throw new Error('Method not implemented.');
  // }
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;
  private apiUsers = `${environment.apiBaseUrl}/users`;



  localStorage?: Storage;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
  ) { 
    this.localStorage = document.defaultView?.localStorage;
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUserDetail}/${userId}`);
  }

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  // login(loginDTO: LoginDTO): Observable<any> {
  //   return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  // }

  // login(loginDTO: LoginDTO): Observable<any> {
  //   return this.http.post(this.apiLogin, loginDTO, this.apiConfig).pipe(
  //     tap((response: any) => {
  //       const userId = response.userId;
  //       this.localStorage?.setItem('userId', String(userId));
  //     })
  //   );
  // }
  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig).pipe(
        tap((response: any) => {
            const token = response.token;
            this.tokenService.setToken(token); // Save token and decode userId
        })
    );
}

  getUserDetail(token: string): Observable<any> {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO): Observable<any> {
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse): void {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null;
    }
  }

  removeUserFromLocalStorage(): void {
    try {
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }

  removeToken(): void {
    this.localStorage?.removeItem('token');
  }

  getUsers(keyword: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUsers}?keyword=${keyword}&page=${page}&limit=${limit}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUsers, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  // blockOrEnableUser(userId: number, active: boolean): Observable<void> {
  //   return this.http.put<void>(`${this.apiUsers}/${userId}/${active ? 1 : 0}`, null);
  // }
  blockOrEnableUser(userId: number, active: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUsers}/block/${userId}/${active ? 1 : 0}`, null);
  }
  getCurrentUserId(): number {
    return Number(this.localStorage?.getItem('userId')) || 0;
  }

  
}
