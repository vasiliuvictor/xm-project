import { TestBed } from '@angular/core/testing';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return photos from getPhotos', (done) => {
    const mockPhotos = [
      {
        id: '0',
        author: 'Author',
        width: 300,
        height: 200,
        url: 'https://unsplash.com/photos/0',
        download_url: 'https://picsum.photos/id/0/300/200',
      },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockPhotos)))
    );

    service.getPhotos(1).subscribe((photos) => {
      expect(photos.length).toBe(1);
      expect(photos[0].id).toBe('0');
      done();
    });
  });

  it('should return a single photo from getPhotoById', (done) => {
    const mockPhoto = {
      id: '1',
      author: 'Author',
      width: 300,
      height: 200,
      url: 'https://unsplash.com/photos/1',
      download_url: 'https://picsum.photos/id/1/300/200',
    };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockPhoto)))
    );

    service.getPhotoById('1').subscribe((photo) => {
      expect(photo.id).toBe('1');
      expect(photo.author).toBe('Author');
      done();
    });
  });
});
