import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UsersPostsService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public setUsersSelected(ids: Set<number>) {
    this.updateQueryParams({ users: Array.from(ids).join(',') });
  }

  public setSearch(value: string) {
    this.updateQueryParams({ search: value || null });
  }

  public setSort(value: 'recent' | 'title') {
    this.updateQueryParams({ sort: value });
  }

  private updateQueryParams(params: Record<string, any>) {
    this.router.navigate([], {
      queryParams: Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, this.sanitizeParam(value)])
      ),
      queryParamsHandling: 'merge',
      replaceUrl: true,
      relativeTo: this.activatedRoute,
    });
  }

  private sanitizeParam(value: string | null | undefined): string | null {
    return value && value.trim() !== '' ? value : null;
  }
}
