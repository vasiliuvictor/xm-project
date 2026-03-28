import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotosComponent } from './photos.component';
import { PhotoService } from '../../services/photo.service';
import { FavoriteService } from '../../services/favorite.service';
import { Photo } from '../../models/photo.model';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let photoServiceSpy: jasmine.SpyObj<PhotoService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;

  const mockPhotos: Photo[] = [
    {
      id: '1',
      author: 'Author 1',
      width: 300,
      height: 200,
      url: 'https://unsplash.com/photos/1',
      download_url: 'https://picsum.photos/id/1/300/200',
    },
    {
      id: '2',
      author: 'Author 2',
      width: 400,
      height: 300,
      url: 'https://unsplash.com/photos/2',
      download_url: 'https://picsum.photos/id/2/400/300',
    },
  ];

  beforeEach(async () => {
    photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getPhotos']);
    favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', [
      'addFavorite',
      'isFavorite',
    ]);
    photoServiceSpy.getPhotos.and.returnValue(of(mockPhotos));

    await TestBed.configureTestingModule({
      declarations: [PhotosComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: PhotoService, useValue: photoServiceSpy },
        { provide: FavoriteService, useValue: favoriteServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos on init', () => {
    expect(photoServiceSpy.getPhotos).toHaveBeenCalledWith(1);
    expect(component.photos().length).toBe(2);
  });

  it('should generate correct image URL', () => {
    const url = component.getImageUrl(mockPhotos[0]);
    expect(url).toBe('https://picsum.photos/id/1/300/200');
  });

  it('should add photo to favorites', () => {
    favoriteServiceSpy.isFavorite.and.returnValue(false);
    component.addToFavorites(mockPhotos[0]);
    expect(favoriteServiceSpy.addFavorite).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it('should not add duplicate to favorites', () => {
    favoriteServiceSpy.isFavorite.and.returnValue(true);
    component.addToFavorites(mockPhotos[0]);
    expect(favoriteServiceSpy.addFavorite).not.toHaveBeenCalled();
  });
});
