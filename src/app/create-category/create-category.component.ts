import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { ITournament } from '../core/tournament.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ICategory } from '../core/category.interface';

@Component({
  selector: 'app-create-category',
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss',
})
export class CreateCategoryComponent {
  readonly dialogRef = inject(MatDialogRef<CreateCategoryComponent>);
  readonly data = inject<ITournament>(MAT_DIALOG_DATA);

  poolName: string = '';
  playerNames: string = '';
  categoryData: ICategory = {
    id: Date.now(),
    categoryName: '',
    players: [],
  };
  //readonly newGroup = model(this.categoryData);

  onNoClick(): void {
    this.dialogRef.close();
  }

  createPool() {
    // Logic to create a player pool
    console.log('Creating pool:', this.poolName);
    this.categoryData.categoryName = this.poolName;
    const names = this.playerNames
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    this.categoryData.players = names.map((name, index) => ({
      id: Date.now() + index,
      name: name,
      initialPoolId: this.categoryData.id,
    }));
    this.dialogRef.close(this.categoryData);
  }
}
