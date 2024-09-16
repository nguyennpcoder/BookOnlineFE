import { EbookService } from './ebook.service';
import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpParams, 
  HttpHeaders 
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { TokenService } from './token.service';
import { OrderStatusDetailDTO } from '../dtos/order/order-status-detail.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  private apiOrders = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}


  placeOrder(orderData: OrderDTO): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    return this.http.post(this.apiUrl, orderData);
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }

  //detail user
  getOrderByUserId(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/order-user/${orderId}`;
    return this.http.get(url);
  }

  // getAllOrdersByUserId(userId: number, keyword: string, page: number, limit: number): Observable<any> {
  //   const url = `${this.apiUrl}/user/${userId}`;
  //   const params = new HttpParams()
  //     .set('keyword', keyword)
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());
  //   return this.http.get<any>(url, { params });
  // }
  
  getAllOrdersByUserId(userId: number, keyword: string, page: number, limit: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}`;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.get<any>(url, { params, headers });
  }
  

  getAllOrders(keyword:string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
      const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllOrders, { params });
  }
  updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }
  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  //khóa ebook
  updateActiveStatus(orderId: number): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/orders/${orderId}/status`, {}).pipe(
      catchError(error => {
        // Handle error response
        console.error('Update status error:', error);
        return throwError(() => new Error('Failed to update status.'));
      })
    );
  }
  
  // getOrderStatus(orderId: number): Observable<{ status: string }> {
  //   return this.http.get<{ status: string }>(`${environment.apiBaseUrl}/orders/${orderId}/status`);
  // }

  // getOrderStatus(orderId: number): Observable<OrderStatusDetailDTO> {
  //   return this.http.get<OrderStatusDetailDTO>(`http://localhost:8088/api/v1/orders/status`);
  // }

  getAllOrdersStatus(): Observable<OrderStatusDetailDTO[]> {
    const userId = this.tokenService.getUserId(); // Lấy userId từ TokenService
    if (!userId) {
      throw new Error('User is not logged in');
    }
    return this.http.get<OrderStatusDetailDTO[]>(`${environment.apiBaseUrl}/orders/status/${userId}`);
  }

  
  cancelOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/cancel/${orderId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    return this.http.put(url, {}, { headers });
  }

}
