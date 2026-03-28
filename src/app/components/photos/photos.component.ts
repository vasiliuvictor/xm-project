import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { FavoriteService } from '../../services/favorite.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);

  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef;

  private currentPage = 1;
  private observer!: IntersectionObserver;
  private destroy$ = new Subject<void>();

  constructor(
    private photoService: PhotoService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  addToFavorites(photo: Photo): void {
    if (this.favoriteService.isFavorite(photo.id)) {
      this.snackBar.open('Already in favorites!', 'OK');
      return;
    }
    this.favoriteService.addFavorite(photo);
    this.snackBar.open('Added to favorites!', 'OK');
  }

  getImageUrl(photo: Photo): string {
    return `https://picsum.photos/id/${photo.id}/300/200`;
  }

  private loadPhotos(): void {
    if (this.loading()) return;
    this.loading.set(true);

    this.photoService
      .getPhotos(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (photos) => {
          this.photos.update((current) => [...current, ...photos]);
          this.currentPage++;
          this.loading.set(false);
          this.checkAndLoadMore();
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  private checkAndLoadMore(): void {
    if (!this.scrollSentinel) return;
    const rect = this.scrollSentinel.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (rect.top <= viewportHeight + 200) {
      this.loadPhotos();
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.loading()) {
          this.loadPhotos();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 200px 0px' }
    );

    this.observer.observe(this.scrollSentinel.nativeElement);
  }
}
