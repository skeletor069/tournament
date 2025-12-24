import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ITournament } from '../core/tournament.interface';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { DrawState } from '../app.component';
import { StorageService } from '../storage.service';
import { ITeam } from '../core/team.interface';
import { IMatch } from '../core/match.interface';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input()
  selectedTournament: ITournament | null = null;

  @Output()
  onNewTournament = new EventEmitter();

  readonly dialog = inject(MatDialog);

  storageService = inject(StorageService);

  showButtons() {
    return !DrawState.drawStarted && !this.selectedTournament?.gameStarted;
  }

  showStartGameButton(): boolean {
    if (!this.selectedTournament) return false;

    const availableCount = this.selectedTournament.categories
      .map((c) => c.players.filter((p) => !p.assignedToGroup).length)
      .reduce((previuos, current) => previuos + current);
    return availableCount === 0;
  }

  stopGame() {
    if (!this.selectedTournament) return;
    this.selectedTournament.gameStarted = false;
    this.storageService.save(this.selectedTournament);
  }

  newTournament() {
    this.onNewTournament.emit();
  }

  startGame() {
    if (!this.selectedTournament) return;

    this.selectedTournament.groups.forEach((group) => {
      const groupMatches = this.generateRestOptimizedSchedule(group.teams);
      group.groupMatches = groupMatches;
    });

    this.selectedTournament.gameStarted = true;
    this.storageService.save(this.selectedTournament);
  }

  addCategory() {
    // Logic to add a category
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      data: this.selectedTournament,
    });

    dialogRef.afterClosed().subscribe((category) => {
      console.log('The dialog was closed');
      if (category !== undefined) {
        console.log('Creating category with data:', category);
        this.selectedTournament?.categories.push(category);
        this.storageService.save(this.selectedTournament);
      }
    });
  }

  addGroup() {
    // Logic to add a group
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      data: this.selectedTournament,
    });

    dialogRef.afterClosed().subscribe((group) => {
      console.log('The dialog was closed');
      if (group !== undefined) {
        console.log('Creating group with data:', group);
        this.selectedTournament?.groups.push(group);
        this.storageService.save(this.selectedTournament);
      }
    });
  }

  private generateRestOptimizedSchedule(participants: ITeam[]): IMatch[] {
    const teams = [...participants];

    // Handle odd numbers with a placeholder
    const dummyBye: ITeam = { id: -1, players: [] };
    if (teams.length % 2 !== 0) {
      teams.push(dummyBye);
    }

    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;
    const allMatches: IMatch[] = [];

    for (let round = 0; round < numRounds; round++) {
      const roundMatches: IMatch[] = [];

      for (let i = 0; i < matchesPerRound; i++) {
        const home = teams[i];
        const away = teams[numTeams - 1 - i];

        // Only add matches that don't involve the 'BYE' team
        if (home.id !== -1 && away.id !== -1) {
          roundMatches.push({ home, away });
        }
      }

      // REST OPTIMIZATION:
      // Flip the order of matches in alternating rounds.
      // This prevents the last team of Round 1 from playing first in Round 2.
      if (round % 2 === 1) {
        roundMatches.reverse();
      }

      allMatches.push(...roundMatches);

      // Rotate the "Circle" (Standard Round Robin rotation)
      const lastTeam = teams.pop();
      if (lastTeam) {
        teams.splice(1, 0, lastTeam);
      }
    }

    return allMatches;
  }
}
