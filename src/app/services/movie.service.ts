import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum SearchType {
  all = '',
  movie = 'movie',
  series = 'series',
  episode = 'episode'
}

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private url = 'https://www.omdbapi.com/';
  private apiKey = 'a21d8f2b';
  
  // Signals for favorites management
  favorites = signal<Movie[]>(this.loadFavorites());
  searchHistory = signal<string[]>(this.loadSearchHistory());

  constructor(private http: HttpClient) {}

  searchData(title: string, type: SearchType): Observable<Movie[]> {
    if (!title || title.trim() === '') {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    
    this.addToSearchHistory(title);
    
    return this.http.get<{ Search: Movie[] }>(`${this.url}?s=${encodeURI(title)}&type=${type}&apikey=${this.apiKey}`).pipe(
      map(results => results.Search || [])
    );
  }

  getDetails(id: string): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.url}?i=${id}&plot=full&apikey=${this.apiKey}`);
  }

  // Favorites management
  toggleFavorite(movie: Movie): void {
    const currentFavorites = this.favorites();
    const index = currentFavorites.findIndex(fav => fav.imdbID === movie.imdbID);
    
    if (index > -1) {
      currentFavorites.splice(index, 1);
    } else {
      currentFavorites.push(movie);
    }
    
    this.favorites.set([...currentFavorites]);
    this.saveFavorites(currentFavorites);
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites().some(fav => fav.imdbID === imdbID);
  }

  private loadFavorites(): Movie[] {
    const stored = localStorage.getItem('movieFavorites');
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavorites(favorites: Movie[]): void {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }

  // Search history management
  private addToSearchHistory(term: string): void {
    const history = this.searchHistory();
    const filtered = history.filter(item => item !== term);
    filtered.unshift(term);
    const newHistory = filtered.slice(0, 10); // Keep only last 10 searches
    this.searchHistory.set(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  }

  private loadSearchHistory(): string[] {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  }

  clearSearchHistory(): void {
    this.searchHistory.set([]);
    localStorage.removeItem('searchHistory');
  }
}