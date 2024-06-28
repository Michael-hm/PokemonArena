import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.model';
import { SessionService } from '../../shared/session.service';
import { TranslationService } from '../../shared/tranlation.service';


@Component({
  selector: 'app-scoring',
  standalone: true,
  imports: [],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.css',
})
export class ScoringComponent implements OnInit {
  players: IUser[] = [];
  translations: any;

  constructor(private sessionService: SessionService,private translationService: TranslationService, ) {}

  async ngOnInit(): Promise<void> {
    this.translations =  await this.translationService.getText();
    this.getPlayers();
  }

  async getPlayers(): Promise<void> {
    this.players = (await this.sessionService.getAllUsers()).sort((a, b) => b.points - a.points);
  }
}
