import { Injectable } from '@angular/core';
import { Observable, from, delay, switchMap, of } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly apiUrl = 'https://picsum.photos/v2/list';
  private readonly pageSize = 12;

  getPhotos(page: number): Observable<Photo[]> {
    const randomDelay = Math.floor(Math.random() * 101) + 200; // 200-300ms

    return of(null).pipe(
      delay(randomDelay),
      switchMap(() =>
        from(
          fetch(
            `${this.apiUrl}?page=${page}&limit=${this.pageSize}`
          ).then((res) => res.json() as Promise<Photo[]>)
        )
      )
    );
  }

  getPhotoById(id: string): Observable<Photo> {
    return from(
      fetch(`https://picsum.photos/id/${id}/info`).then(
        (res) => res.json() as Promise<Photo>
      )
    );
  }
}
