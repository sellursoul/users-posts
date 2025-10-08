import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { Post } from '../../common/interfaces';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostsSearchComponent, PostsSortComponent } from './components';
import { VirtualScrollComponent } from '../../../../shared';

@Component({
  selector: 'posts-list',
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListModule,
    MatCardModule,
    MatButtonModule,
    PostsSearchComponent,
    PostsSortComponent,
    VirtualScrollComponent,
  ],
})
export class PostsListComponent {
  public readonly posts = input.required<Post[]>();
  public readonly openPost = output<Post>();

  public readonly estimateHeight = (post: Post) => 94;
}
