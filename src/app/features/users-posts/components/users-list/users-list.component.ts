import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { User } from '../../common/interfaces';
import { UsersPostsService, UsersPostsStore } from '../../services';
import { VirtualScrollComponent } from '../../../../shared';
@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, MatIconModule, VirtualScrollComponent],
})
export class UsersListComponent {
  private readonly usersPostsStore = inject(UsersPostsStore);
  private readonly usersPostsService = inject(UsersPostsService);

  protected readonly selectedUsers = computed(() => this.usersPostsStore.query().selectedUsers);
  
  public readonly estimateHeight = (user: User) => 60;

  public readonly users = input.required<User[]>();

  protected selectUser(id: number): void {
    const current = new Set(this.usersPostsStore.query().selectedUsers) as Set<number>;
    current.has(id) ? current.delete(id) : current.add(id);
    this.usersPostsService.setUsersSelected(current);
  }
}
