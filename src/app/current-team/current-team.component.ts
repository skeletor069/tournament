import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ITeam } from '../core/team.interface';
import { IPlayer } from '../core/player.interface';
import { CommonModule } from '@angular/common';
import { DrawState } from '../app.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-current-team',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './current-team.component.html',
  styleUrl: './current-team.component.scss',
})
export class CurrentTeamComponent {
  currentTeam: ITeam | null = this.createNewTeam();

  @Input()
  groupAndPoolAvailable = false;

  @Output()
  teamCompleted = new EventEmitter<ITeam>();

  @Output()
  onStartDraw = new EventEmitter<void>();

  private createNewTeam(): ITeam {
    return {
      id: Date.now(),
      players: [],
      groupPoints: 0,
    };
  }

  onPickPlayer(player: IPlayer) {
    if (!this.currentTeam || this.currentTeam.players.length === 2) {
      this.currentTeam = this.createNewTeam();
    }
    this.currentTeam.players.push(player);
    if (this.currentTeam.players.length === 2) {
      // send team to group component
      this.teamCompleted.emit(this.currentTeam);
      DrawState.animating = true;
      console.log('Team completed:', this.currentTeam);
    }
  }

  getPlayer2Name() {
    if (!this.currentTeam || this.currentTeam.players.length < 2) {
      return '?';
    }

    return this.currentTeam.players[1].name;
  }
  getPlayer1Name() {
    if (!this.currentTeam || this.currentTeam.players.length < 1) {
      return '?';
    }

    return this.currentTeam.players[0].name;
  }

  getPlayer2Css() {
    if (!this.currentTeam || this.currentTeam.players.length < 2) {
      return 'ytd';
    }

    return '';
  }
  getPlayer1Css() {
    if (!this.currentTeam || this.currentTeam.players.length < 1) {
      return 'ytd';
    }

    return '';
  }

  onAssignTeam() {
    this.currentTeam = this.createNewTeam();
  }

  drawStarted() {
    return DrawState.drawStarted;
  }

  startDraw() {
    DrawState.drawStarted = true;
    this.onStartDraw.emit();
  }
}
