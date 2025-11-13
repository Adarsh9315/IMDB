import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonChip,
  IonBadge,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starHalf, starOutline, clipboard, people, calendar, time, globe, trophy, heart, heartOutline, shareOutline } from 'ionicons/icons';
import { MovieService, MovieDetails } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonChip,
    IonBadge,
    IonSkeletonText
  ]
})
export class MovieDetailsPage implements OnInit {
  information = signal<MovieDetails | null>(null);
  loading = signal(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    public movieService: MovieService
  ) {
    addIcons({ star, starHalf, starOutline, clipboard, people, calendar, time, globe, trophy, heart, heartOutline, shareOutline });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getDetails(id).subscribe({
        next: (result) => {
          this.information.set(result);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }

  openWebsite() {
    const info = this.information();
    if (info?.Website && info.Website !== 'N/A') {
      window.open(info.Website, '_blank');
    }
  }

  getStarArray(rating: string): { type: string }[] {
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return [];
    
    const stars = [];
    const fullStars = Math.floor(numRating / 2);
    const hasHalfStar = (numRating / 2) % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'star' });
    }
    
    if (hasHalfStar) {
      stars.push({ type: 'star-half' });
    }
    
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push({ type: 'star-outline' });
    }
    
    return stars;
  }

  getGenres(): string[] {
    const info = this.information();
    return info?.Genre ? info.Genre.split(', ') : [];
  }

  async shareMovie() {
    const info = this.information();
    if (!info) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: info.Title,
          text: `Check out ${info.Title} (${info.Year})`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  }

  isFavorite(): boolean {
    const info = this.information();
    return info ? this.movieService.isFavorite(info.imdbID) : false;
  }

  toggleFavorite() {
    const info = this.information();
    if (info) {
      const movie = {
        Title: info.Title,
        Year: info.Year,
        imdbID: info.imdbID,
        Type: info.Type,
        Poster: info.Poster
      };
      this.movieService.toggleFavorite(movie);
    }
  }
}