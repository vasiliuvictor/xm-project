import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesComponent } from './favorites.component';
import { FavoriteService } from '../../services/favorite.service';
import { Photo } from '../../models/photo.model';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesSignal: ReturnType<typeof signal<Photo[]>>;

  const mockPhotos: Photo[] = [
    {
      id: '1',
      author: 'Author 1',
      width: 300,
      height: 200,
      url: 'https://unsplash.com/photos/1',
      download_url: 'https://picsum.photos/id/1/300/200',
    },
  ];

  beforeEach(async () => {
    favoritesSignal = signal<Photo[]>([]);

    await TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      imports: [RouterTestingModule, MatCardModule, MatIconModule],
      providers: [
        {
          provide: FavoriteService,
          useValue: { favorites: favoritesSignal.asReadonly() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no favorites', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });

  it('should display favorites when available', () => {
    favoritesSignal.set(mockPhotos);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeNull();
    expect(compiled.querySelectorAll('.photo-card').length).toBe(1);
  });

  it('should generate correct image URL', () => {
    const url = component.getImageUrl(mockPhotos[0]);
    expect(url).toBe('https://picsum.photos/id/1/300/200');
  });
});
