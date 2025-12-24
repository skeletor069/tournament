import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatFormField,
  MatLabel,
  MatInputModule,
} from '@angular/material/input';
import { ITournament } from '../core/tournament.interface';
import { IGroup } from '../core/group.interface';

@Component({
  selector: 'app-create-group',
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
})
export class CreateGroupComponent {
  readonly dialogRef = inject(MatDialogRef<CreateGroupComponent>);
  readonly data = inject<ITournament>(MAT_DIALOG_DATA);
  groupData: IGroup = {
    id: Date.now(),
    name: '',
    teams: [],
  };
  groupName: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }

  createGroup() {
    // Logic to create a group
    console.log('Creating group:', this.groupData.name);
    this.groupData.name = this.groupName;
    this.dialogRef.close(this.groupData);
  }
}
