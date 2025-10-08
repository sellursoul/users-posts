import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UsersPostsStore, UsersPostsService } from '../../../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'posts-sort',
  templateUrl: './posts-sort.component.html',
  styleUrl: './posts-sort.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
})
export class PostsSortComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly usersPostsStore = inject(UsersPostsStore);
  private readonly usersPostsService = inject(UsersPostsService);

  protected readonly sortControl = new FormControl<'recent' | 'title'>('recent', {
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      const currentSort = this.usersPostsStore.query().sort;
      if (this.sortControl.value !== currentSort) {
        this.sortControl.setValue(currentSort, { emitEvent: false });
      }
    });
  }

  public ngOnInit(): void {
    if (!this.usersPostsStore.query().sort) {
      this.usersPostsService.setSort(this.sortControl.value);
    }

    this.sortControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sort) => this.usersPostsService.setSort(sort));
  }
}
