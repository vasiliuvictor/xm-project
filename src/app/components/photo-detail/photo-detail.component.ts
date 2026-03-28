import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Photo } from '../../models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailComponent implements OnInit {
  readonly photo = signal<Photo | null>(null);
  readonly loading = signal(true);
  readonly fullImageUrl = computed(() => {
    const p = this.photo();
    return p ? `https://picsum.photos/id/${p.id}/800/600` : '';
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private photoService: PhotoService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.photoService.getPhotoById(id).subscribe({
        next: (photo) => {
          this.photo.set(photo);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    }
  }

  removeFromFavorites(): void {
    const p = this.photo();
    if (p) {
      this.favoriteService.removeFavorite(p.id);
      this.snackBar.open('Removed from favorites!', 'OK');
      this.router.navigate(['/favorites']);
    }
  }
}
