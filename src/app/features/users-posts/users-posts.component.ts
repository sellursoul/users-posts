import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersListComponent, PostsListComponent, PostDialogComponent } from './components';
import { UsersPostsStore } from './services';
import { Post } from './common/interfaces';
import { generatePosts, generateUsers } from './common/utils/data-generator';

@Component({
  selector: 'users-posts',
  templateUrl: './users-posts.component.html',
  styleUrl: './users-posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    UsersListComponent,
    PostsListComponent,
  ],
})
export class UsersPostsComponent implements OnInit {
  private readonly usersPostsStore = inject(UsersPostsStore);
  private readonly dialog = inject(MatDialog);

  protected readonly users = this.usersPostsStore.users;
  protected readonly posts = this.usersPostsStore.filteredPosts;

  public ngOnInit(): void {
    this.usersPostsStore.users.set(generateUsers());
    this.usersPostsStore.posts.set(generatePosts(10000, this.users()));
  }

  protected openPostDialog(post: Post): void {
    this.dialog.open(PostDialogComponent, {
      data: post,
      width: '600px',
    });
  }
}
