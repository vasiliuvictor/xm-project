import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  readonly favorites = this.favoriteService.favorites;

  constructor(private favoriteService: FavoriteService) {}

  getImageUrl(photo: Photo): string {
    return `https://picsum.photos/id/${photo.id}/300/200`;
  }
}
