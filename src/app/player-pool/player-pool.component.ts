import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICategory } from '../core/category.interface';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IPlayer } from '../core/player.interface';
import { DrawState } from '../app.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-player-pool',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './player-pool.component.html',
  styleUrl: './player-pool.component.scss',
})
export class PlayerPoolComponent {
  @Input()
  category: ICategory | null = null;

  @Output()
  deleteCategory = new EventEmitter<ICategory>();

  @Output()
  pickPlayer = new EventEmitter<IPlayer>();

  onDeleteCategory() {
    if (this.category) {
      console.log('Deleting category with id:', this.category.id);
      // Implement deletion logic here
      this.deleteCategory.emit(this.category);
    }
  }

  onPickPlayer() {
    if (this.category) {
      console.log('Picking player from category with id:', this.category.id);
      const availablePlayers = this.category.players.filter(
        (p) => !p.assignedToGroup && !p.picked
      );
      const index = Math.floor(Math.random() * availablePlayers.length);
      const player = availablePlayers[index];
      player.picked = true;
      this.pickPlayer.emit(player);
      //this.category.players.splice(index, 1);
      // Implement player picking logic here
    }
  }

  getCssClass(player: IPlayer) {
    return player.assignedToGroup ? 'assigned' : player.picked ? 'picked' : '';
  }

  isDrawStarted() {
    return DrawState.drawStarted;
  }

  isAnimating() {
    return DrawState.animating;
  }

  isPlayerAvailable() {
    if (!this.category) return false;
    return this.category.players.filter((p) => !p.assignedToGroup).length > 0;
  }
}
