import { inject, Injectable } from '@angular/core';
import { ITournament } from './core/tournament.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly keyPrefix = 'tournament-storage';
  private data: any = {};

  constructor() {
    this.load();
  }

  load() {
    const savedData = localStorage.getItem(this.keyPrefix);
    this.data = savedData ? JSON.parse(savedData) : {};
  }

  save(tournament: ITournament | null) {
    if (!tournament) return;
    this.data[tournament.id] = tournament;
    console.log('Saving', this.data);
    localStorage.setItem(this.keyPrefix, JSON.stringify(this.data));
  }

  getAll() {
    const tournaments: ITournament[] = [];
    for (let key in this.data) {
      tournaments.push(this.data[key]);
    }
    return tournaments;
  }
}
