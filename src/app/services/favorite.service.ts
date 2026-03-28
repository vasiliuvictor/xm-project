import { Injectable, signal, computed } from '@angular/core';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private static readonly STORAGE_KEY = 'photo_favorites';

  private readonly favoritesSignal = signal<Photo[]>(this.loadFromStorage());

  readonly favorites = this.favoritesSignal.asReadonly();

  addFavorite(photo: Photo): void {
    const current = this.favoritesSignal();
    if (!current.some((f) => f.id === photo.id)) {
      const updated = [...current, photo];
      this.saveToStorage(updated);
      this.favoritesSignal.set(updated);
    }
  }

  removeFavorite(photoId: string): void {
    const updated = this.favoritesSignal().filter((f) => f.id !== photoId);
    this.saveToStorage(updated);
    this.favoritesSignal.set(updated);
  }

  isFavorite(photoId: string): boolean {
    return this.favoritesSignal().some((f) => f.id === photoId);
  }

  private loadFromStorage(): Photo[] {
    const data = localStorage.getItem(FavoriteService.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(photos: Photo[]): void {
    localStorage.setItem(FavoriteService.STORAGE_KEY, JSON.stringify(photos));
  }
}
