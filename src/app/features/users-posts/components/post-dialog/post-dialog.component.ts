import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Post } from '../../common/interfaces';
import { generateComments } from '../../common/utils/data-generator';

@Component({
  selector: 'post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatListModule, MatButtonModule],
})
export class PostDialogComponent {
  protected readonly data = inject<Post>(MAT_DIALOG_DATA);
  protected readonly comments = generateComments(this.data.id);
}
