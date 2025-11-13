import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full'
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.page').then(m => m.MoviesPage)
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movie-details/movie-details.page').then(m => m.MovieDetailsPage)
  }
];
