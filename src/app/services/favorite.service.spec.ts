import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { Photo } from '../models/photo.model';

describe('FavoriteService', () => {
  let service: FavoriteService;

  const mockPhoto: Photo = {
    id: '1',
    author: 'Test Author',
    width: 300,
    height: 200,
    url: 'https://unsplash.com/photos/1',
    download_url: 'https://picsum.photos/id/1/300/200',
  };

  const mockPhoto2: Photo = {
    id: '2',
    author: 'Test Author 2',
    width: 400,
    height: 300,
    url: 'https://unsplash.com/photos/2',
    download_url: 'https://picsum.photos/id/2/400/300',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty favorites', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('should add a photo to favorites', () => {
    service.addFavorite(mockPhoto);
    expect(service.favorites().length).toBe(1);
    expect(service.favorites()[0].id).toBe('1');
  });

  it('should not add duplicate photos', () => {
    service.addFavorite(mockPhoto);
    service.addFavorite(mockPhoto);
    expect(service.favorites().length).toBe(1);
  });

  it('should remove a photo from favorites', () => {
    service.addFavorite(mockPhoto);
    service.addFavorite(mockPhoto2);
    service.removeFavorite('1');
    expect(service.favorites().length).toBe(1);
    expect(service.favorites()[0].id).toBe('2');
  });

  it('should correctly check if a photo is a favorite', () => {
    service.addFavorite(mockPhoto);
    expect(service.isFavorite('1')).toBeTrue();
    expect(service.isFavorite('999')).toBeFalse();
  });

  it('should persist favorites to localStorage', () => {
    service.addFavorite(mockPhoto);
    const stored = JSON.parse(
      localStorage.getItem('photo_favorites') || '[]'
    );
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe('1');
  });

  it('should load favorites from localStorage on init', () => {
    localStorage.setItem('photo_favorites', JSON.stringify([mockPhoto]));
    const newService = new FavoriteService();
    expect(newService.favorites().length).toBe(1);
  });
});
