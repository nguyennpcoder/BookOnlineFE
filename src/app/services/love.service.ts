import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoveService {
  private love: Map<number, number> = new Map<number, number>();
  private localStorage: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage!;
    this.refreshLove();
  }

  public refreshLove(): void {
    const storedLove = this.localStorage.getItem(this.getLoveKey());
    this.love = storedLove ? new Map<number, number>(JSON.parse(storedLove)) : new Map<number, number>();
  }


  private getLoveKey(): string {
    const userResponseJSON = this.localStorage.getItem('user');
    const userResponse = userResponseJSON ? JSON.parse(userResponseJSON) : {};
    return `love:${userResponse.id ?? ''}`;
  }

  addToLove(ebookId: number, quantity: number = 1): void {
    this.love.set(ebookId, (this.love.get(ebookId) || 0) + quantity);
    this.saveLoveToLocalStorage();
  }

  removeFromLove(ebookId: number): void {
    this.love.delete(ebookId);
    this.saveLoveToLocalStorage();
  }

  getLove(): Map<number, number> {
    return this.love;
  }

  private saveLoveToLocalStorage(): void {
    this.localStorage.setItem(this.getLoveKey(), JSON.stringify(Array.from(this.love.entries())));
  }

  setLove(love: Map<number, number>): void {
    this.love = love ?? new Map<number, number>();
    this.saveLoveToLocalStorage();
  }

  clearLove(): void {
    this.love.clear();
    this.saveLoveToLocalStorage();
  }

  isProductInLove(productId: number): boolean {
    return this.love.has(productId);
  }

  getTotalLoveItemCount(): number {
    let total = 0;
    this.love.forEach(quantity => total += quantity);
    return total;
  }
 
  
}
