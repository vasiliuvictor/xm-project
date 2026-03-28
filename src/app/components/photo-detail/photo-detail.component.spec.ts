import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoDetailComponent } from './photo-detail.component';
import { PhotoService } from '../../services/photo.service';
import { FavoriteService } from '../../services/favorite.service';
import { Photo } from '../../models/photo.model';

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let photoServiceSpy: jasmine.SpyObj<PhotoService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPhoto: Photo = {
    id: '1',
    author: 'Test Author',
    width: 300,
    height: 200,
    url: 'https://unsplash.com/photos/1',
    download_url: 'https://picsum.photos/id/1/300/200',
  };

  beforeEach(async () => {
    photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getPhotoById']);
    favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', [
      'removeFavorite',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    photoServiceSpy.getPhotoById.and.returnValue(of(mockPhoto));

    await TestBed.configureTestingModule({
      declarations: [PhotoDetailComponent],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: PhotoService, useValue: photoServiceSpy },
        { provide: FavoriteService, useValue: favoriteServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photo on init', () => {
    expect(photoServiceSpy.getPhotoById).toHaveBeenCalledWith('1');
    expect(component.photo()).toEqual(mockPhoto);
    expect(component.loading()).toBeFalse();
  });

  it('should compute full image URL', () => {
    expect(component.fullImageUrl()).toBe(
      'https://picsum.photos/id/1/800/600'
    );
  });

  it('should remove from favorites and navigate back', () => {
    component.removeFromFavorites();
    expect(favoriteServiceSpy.removeFavorite).toHaveBeenCalledWith('1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
