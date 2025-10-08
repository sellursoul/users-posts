import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users-posts',
  },
  {
    path: 'users-posts',
    loadChildren: async () => (await import('./features/users-posts/users-posts.routes')).routes,
  },
  {
    path: '**',
    redirectTo: 'users-posts',
  },
];
