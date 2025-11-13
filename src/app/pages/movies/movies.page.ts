import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  IonAvatar,
  IonIcon,
  IonButton,
  IonButtons,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonChip,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { videocam, tv, gameController, heart, heartOutline, moon, sunny, search, close } from 'ionicons/icons';
import { MovieService, SearchType, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonList,
    IonAvatar,
    IonIcon,
    IonButton,
    IonButtons,
    IonSkeletonText,
    IonCard,
    IonCardContent,
    IonChip,
    IonRefresher,
    IonRefresherContent
  ]
})
export class MoviesPage implements OnInit {
  searchTerm = signal('');
  type = signal<SearchType>(SearchType.all);
  results = signal<Movie[]>([]);
  loading = signal(false);
  darkMode = signal(false);
  showHistory = signal(false);

  favorites = computed(() => this.movieService.favorites());
  searchHistory = computed(() => this.movieService.searchHistory());

  constructor(public movieService: MovieService) {
    addIcons({ videocam, tv, gameController, heart, heartOutline, moon, sunny, search, close });
  }

  ngOnInit() {
    // Check for saved dark mode preference
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    this.darkMode.set(prefersDark);
    this.toggleDarkMode(prefersDark);
  }

  searchChanged(event?: any) {
    const term = this.searchTerm();
    if (!term || term.trim() === '') {
      this.results.set([]);
      return;
    }

    this.loading.set(true);
    this.showHistory.set(false);
    
    this.movieService.searchData(term, this.type()).subscribe({
      next: (data) => {
        this.results.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
      }
    });
  }

  onSearchFocus() {
    if (!this.searchTerm() || this.searchTerm().trim() === '') {
      this.showHistory.set(true);
    }
  }

  selectHistoryItem(term: string) {
    this.searchTerm.set(term);
    this.showHistory.set(false);
    this.searchChanged();
  }

  clearHistory() {
    this.movieService.clearSearchHistory();
  }

  toggleFavorite(event: Event, movie: Movie) {
    event.stopPropagation();
    event.preventDefault();
    this.movieService.toggleFavorite(movie);
  }

  isFavorite(imdbID: string): boolean {
    return this.movieService.isFavorite(imdbID);
  }

  toggleDarkMode(checked?: boolean) {
    const isDark = checked !== undefined ? checked : !this.darkMode();
    this.darkMode.set(isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  handleRefresh(event: any) {
    this.searchChanged();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getSkeletonArray() {
    return Array(6).fill(0);
  }
}