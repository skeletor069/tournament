import { Component, inject, Output, ViewChild } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { HeaderComponent } from './header/header.component';
import { CreateTournamentComponent } from './create-tournament/create-tournament.component';
import { ITournament } from './core/tournament.interface';
import { CommonModule } from '@angular/common';
import { PlayerPoolComponent } from './player-pool/player-pool.component';
import { ICategory } from './core/category.interface';
import { IPlayer } from './core/player.interface';
import { IGroup } from './core/group.interface';
import { MatButtonModule } from '@angular/material/button';
import { CurrentTeamComponent } from './current-team/current-team.component';
import { ITeam } from './core/team.interface';
import { StorageService } from './storage.service';
import { PointsTableComponent } from './points-table/points-table.component';

export class DrawState {
  public static animating = false;
  public static drawStarted = false;
  public static gameStarted = false;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    GroupComponent,
    HeaderComponent,
    PlayerPoolComponent,
    CreateTournamentComponent,
    MatButtonModule,
    CurrentTeamComponent,
    PointsTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TournamentDraw';
  selectedTournament: ITournament | null = null;
  selectedGroup: IGroup | null = null;

  storageService = inject(StorageService);

  @ViewChild('currentTeam')
  currentTeam?: CurrentTeamComponent;

  // constructor() {
  //   this.selectedTournament = {
  //     id: 1,
  //     name: 'WS 2025 Male',
  //     categories: [
  //       {
  //         id: 1,
  //         categoryName: 'Pool A',
  //         players: [
  //           { id: 1, name: 'Player 1' },
  //           { id: 2, name: 'Player 2' },
  //           { id: 3, name: 'Player 3' },
  //           { id: 4, name: 'Player 4' },
  //           { id: 5, name: 'Player 5' },
  //           { id: 27, name: 'Player 27' },
  //           { id: 28, name: 'Player 28' },
  //         ],
  //       },
  //       {
  //         id: 2,
  //         categoryName: 'Pool B',
  //         players: [
  //           { id: 6, name: 'Player 6' },
  //           { id: 7, name: 'Player 7' },
  //           { id: 8, name: 'Player 8' },
  //           { id: 9, name: 'Player 9' },
  //           { id: 10, name: 'Player 10' },
  //           { id: 16, name: 'Player 16' },
  //           { id: 17, name: 'Player 17' },
  //           { id: 18, name: 'Player 18' },
  //           { id: 19, name: 'Player 19' },
  //           { id: 20, name: 'Player 20' },
  //           { id: 21, name: 'Player 21' },
  //           { id: 22, name: 'Player 22' },
  //           { id: 23, name: 'Player 23' },
  //           { id: 24, name: 'Player 24' },
  //           { id: 25, name: 'Player 25' },
  //           { id: 26, name: 'Player 26' },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         categoryName: 'Pool C',
  //         players: [
  //           { id: 11, name: 'Player 11' },
  //           { id: 12, name: 'Player 12' },
  //           { id: 13, name: 'Player 13' },
  //           { id: 14, name: 'Player 14' },
  //           { id: 15, name: 'Player 15' },
  //           { id: 29, name: 'Player 29' },
  //           { id: 30, name: 'Player 30' },
  //         ],
  //       },
  //     ],
  //     groups: [
  //       {
  //         id: 1,
  //         name: 'Group 1',
  //         teams: [],
  //       },
  //       {
  //         id: 2,
  //         name: 'Group 2',
  //         teams: [],
  //       },
  //       {
  //         id: 3,
  //         name: 'Group 3',
  //         teams: [],
  //       },
  //     ],
  //   };
  // }

  onNewTournament() {
    this.selectedTournament = null;
    this.selectedGroup = null;
    DrawState.animating = false;
    DrawState.drawStarted = false;
  }

  onTournamentCreated(tournament: ITournament) {
    this.selectedTournament = tournament;
    this.storageService.save(tournament);
    console.log('Tournament created in AppComponent:', tournament);
  }

  onDeleteCategory(category: ICategory) {
    if (this.selectedTournament) {
      this.selectedTournament.categories =
        this.selectedTournament.categories.filter((c) => c.id !== category.id);
      this.storageService.save(this.selectedTournament);
      console.log('Category deleted in AppComponent:', category);
    }
  }

  // onPickPlayer(player: IPlayer) {
  //   console.log('Player picked in AppComponent:', player);
  //   //
  // }

  onSelectGroup(group: IGroup) {
    console.log('Group selected in AppComponent:', group);
    this.selectedGroup = group;
  }

  onDeleteGroup(group: IGroup) {
    if (this.selectedTournament) {
      this.selectedTournament.groups = this.selectedTournament.groups.filter(
        (g) => g.id !== group.id
      );
      if (this.selectedGroup?.id === group.id) {
        this.selectedGroup = null;
      }
      this.storageService.save(this.selectedTournament);
    }
  }

  onRandomGroupSelect() {
    if (this.selectedTournament && this.selectedTournament.groups.length > 0) {
      const teamCounts = this.selectedTournament.groups.map(
        (g) => g.teams.length
      );
      const minimumCount = Math.min(...teamCounts);
      const targetGroups = this.selectedTournament.groups.filter(
        (g) => g.teams.length === minimumCount
      );
      const randomIndex = Math.floor(Math.random() * targetGroups.length);
      this.selectedGroup = targetGroups[randomIndex];
      console.log('Randomly selected group:', this.selectedGroup);
    }
  }

  onTeamComplete(team: ITeam) {
    if (!this.selectedGroup) {
      this.onRandomGroupSelect();
    }

    const that = this;
    setTimeout(() => {
      team.players.forEach((p) => (p.assignedToGroup = true));
      this.selectedGroup?.teams.push(team);
      this.currentTeam?.onAssignTeam();
      setTimeout(() => {
        this.onRandomGroupSelect();
        DrawState.animating = false;
        this.storageService.save(that.selectedTournament!);
      }, 1000);
    }, 2000);
  }

  onStartDraw() {
    this.onRandomGroupSelect();
  }

  onPlayerFree(player: IPlayer) {
    if (!this.selectedTournament) return;
    const pool = this.selectedTournament.categories.find(
      (c) => c.id === player.initialPoolId
    );
    if (!pool) return;
    const playerData = pool.players.find((p) => p.id === player.id);
    if (!playerData) return;
    playerData.picked = false;
    playerData.assignedToGroup = false;
  }

  isPlayerUnavailable(): boolean {
    if (!this.selectedTournament) return false;

    const availableCount = this.selectedTournament.categories
      .map((c) => c.players.filter((p) => !p.assignedToGroup).length)
      .reduce((previuos, current) => previuos + current);
    return availableCount === 0;
  }
}
