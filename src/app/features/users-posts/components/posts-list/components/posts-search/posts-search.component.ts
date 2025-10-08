import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UsersPostsService, UsersPostsStore } from '../../../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'posts-search',
  templateUrl: './posts-search.component.html',
  styleUrl: './posts-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class PostsSearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly usersPostsService = inject(UsersPostsService);
  private readonly usersPostsStore = inject(UsersPostsStore);

  protected readonly searchControl = new FormControl('');

  constructor() {
    effect(() => {
      const search = this.usersPostsStore.query().search;
      if (this.searchControl.value !== search) {
        this.searchControl.setValue(search, { emitEvent: false });
      }
    });
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.usersPostsStore.query().search),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => this.usersPostsService.setSearch(value ?? ''));
  }
}
