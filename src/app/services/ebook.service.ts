import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Ebook } from '../models/ebook';
import { UpdateEbookDTO } from '../dtos/ebook/update.ebook.dto';
import { InsertEbookDTO } from '../dtos/ebook/insert.ebook.dto';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class EbookService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Check the Observable Stream
  getEbooks(keyword: string,  categoryId: number,
    page: number, limit: number ): Observable<Ebook[]> 
  {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<Ebook[]>(`${this.apiBaseUrl}/ebooks`, { params });
  }

  getEbooksUser(keyword: string,  categoryId: number,
    page: number, limit: number ): Observable<Ebook[]> 
  {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<Ebook[]>(`${this.apiBaseUrl}/ebooks/user`, { params });
  }

  
  getDetailEbook(ebookId: number): Observable<Ebook> {
    return this.http.get<Ebook>(`${this.apiBaseUrl}/ebooks/${ebookId}`);
  }
  
  getEbooksByIds(ebookIds: number[]): Observable<Ebook[]> {
    const params = new HttpParams().set('ids', ebookIds.join(','));
    return this.http.get<Ebook[]>(`${this.apiBaseUrl}/ebooks/by-ids`, { params });
  }
  
  deleteEbook(ebookId: number): Observable<string> {

    return this.http.delete<string>(`${this.apiBaseUrl}/ebooks/${ebookId}`);
  }
  // updateEbook(ebookId: number, updatedEbook: UpdateEbookDTO): Observable<UpdateEbookDTO> {
  //   return this.http.put<Ebook>(`${this.apiBaseUrl}/ebooks/${ebookId}`, updatedEbook);
  // }  

  updateEbook(ebookId: number, updatedEbook: UpdateEbookDTO): Observable<UpdateEbookDTO> {
    // ... existing logic
  
    if (updatedEbook.audioFile) {
      // Upload audio file first and get the updated audio URL
      return this.uploadAudio(ebookId, updatedEbook.audioFile).pipe(
        concatMap((audioUrl: string) => {
          // Update audioUrl property in updatedEbook
          updatedEbook.audioUrl = audioUrl;
  
          // Call the original updateEbook with updated ebook data (including audioUrl)
          return this.http.put<Ebook>(`${this.apiBaseUrl}/ebooks/${ebookId}`, updatedEbook);
        })
      );
    } else {
      // If no audio file is included, directly call the original updateEbook
      return this.http.put<Ebook>(`${this.apiBaseUrl}/ebooks/${ebookId}`, updatedEbook);
    }
  }


  insertEbook(InsertEbookDTO: InsertEbookDTO): Observable<any> {
    // Add a new ebook
    return this.http.post(`${this.apiBaseUrl}/ebooks`, InsertEbookDTO);
  }
  // insertEbook(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/ebooks`, formData);
  // }


  // insertEbook(InsertEbookDTO: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiBaseUrl}/ebooks`, InsertEbookDTO);
  // }

  uploadImages(ebookId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified ebook id
    return this.http.post(`${this.apiBaseUrl}/ebooks/uploads/${ebookId}`, formData);
  }

  uploadmp3s(ebookId: number, audioFile: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < audioFile.length; i++) {
      formData.append('audio', audioFile[i]);
    }
    // Upload mp3s for the specified ebook id
    return this.http.post(`${this.apiBaseUrl}/ebooks/uploadmp3s/${ebookId}`, formData);
  }

  uploadAudio(ebookId: number, audioFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name);

    return this.http.post(`${this.apiBaseUrl}/ebooks/uploadmp3s/${ebookId}`, formData);
  }
  
  deleteEbookImage(id: number): Observable<any> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/ebook_images/${id}`);
  }

  deleteEbookMp3(id: number): Observable<any> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/ebook_mp3s/${id}`);
  }

 updateActiveStatus(ebookId: number): Observable<any> {
  return this.http.put(`${this.apiBaseUrl}/ebooks/${ebookId}/status`, {}).pipe(
    catchError(error => {
      // Handle error response
      console.error('Update status error:', error);
      return throwError(() => new Error('Failed to update status.'));
    })
  );
}
getCategoriesByEbookId(ebookId: number): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiBaseUrl}/ebooks/ebookcategories/${ebookId}`);
}

}
