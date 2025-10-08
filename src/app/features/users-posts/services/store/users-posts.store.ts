import { computed, inject, Injectable, signal } from '@angular/core';
import { User, Post } from '../../common/interfaces';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersPostsStore {
  private readonly activatedRoute = inject(ActivatedRoute);
  
  public readonly users = signal<User[]>([]);
  public readonly posts = signal<Post[]>([]);

  public readonly query = toSignal(
    this.activatedRoute.queryParams.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      map((params) => ({
        selectedUsers: new Set((params['users'] || '').split(',').filter(Boolean).map(Number)),
        search: (params['search'] || '').toLowerCase(),
        sort: params['sort'] as 'recent' | 'title',
      }))
    ),
    { initialValue: { selectedUsers: new Set<number>(), search: '', sort: 'recent' } }
  );

  public readonly filteredPosts = computed(() => {
    const { selectedUsers, search, sort } = this.query();
    const posts = this.posts();

    const filtered = posts
      .filter((p) => !selectedUsers.size || selectedUsers.has(p.userId))
      .filter(({ title, description }) =>
        search
          ? title.toLowerCase().includes(search) || description.toLowerCase().includes(search)
          : true
      );

    const sorted =
      sort === 'title'
        ? [...filtered].sort((a, b) => a.title.localeCompare(b.title))
        : [...filtered].sort((a, b) => b.id - a.id);

    return sorted;
  });
}
