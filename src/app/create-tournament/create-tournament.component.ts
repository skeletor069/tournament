import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ITournament } from '../core/tournament.interface';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-tournament',
  imports: [MatInputModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.scss',
})
export class CreateTournamentComponent {
  @Output()
  onCreateTournament = new EventEmitter<ITournament>();

  tournamentName: string = '';

  storageService = inject(StorageService);

  createNewTournament() {
    const newTournament: ITournament = {
      id: Date.now(),
      name: this.tournamentName,
      categories: [],
      groups: [],
    };
    this.onCreateTournament.emit(newTournament);
  }

  getTournaments() {
    return this.storageService.getAll();
  }

  loadTournament(tournament: ITournament) {
    this.onCreateTournament.emit(tournament);
  }
}
