import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiBaseUrl}/comments/all`);
  }

  deleteComment(commentId: number): Observable<any> {
    debugger
    return this.http.delete(`${this.apiBaseUrl}/comments/${commentId}`,{responseType:"text"});
  }
}
