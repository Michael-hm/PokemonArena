import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { TranslationService } from '../../services/tranlation.service';
import { Route, Router } from '@angular/router';
import { PvpService } from '../../services/pvp.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-room',
  standalone: true,
  imports: [],
  templateUrl: './modal-room.component.html',
  styleUrl: './modal-room.component.css'
})
export class ModalRoomComponent implements OnInit, OnDestroy {
  subscribeRef: Subscription;
  translations: any = { name: '' };
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private pvpService: PvpService

  ) {}
  ngOnDestroy(): void {
    this.subscribeRef.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    const text = await this.translationService.getText();
    this.translations = text.translate;
    this.subscribeRef = this.pvpService.getRoomStatus().subscribe((response) => {
      console.log(response)
      if(!response.isRoomFull && response.success){
        console.log('esperando jugador')
        this.pvpService.player = 1
        this.router.navigateByUrl('battle-arena-multiplayer')
      }else if(response.success){
        this.pvpService.pokemons = response.pokemons
        this.pvpService.player = 2
        this.router.navigateByUrl('battle-arena-multiplayer')
      }else{
        console.log('Sala llena')
        //poner alert o algo asi
      }
      });
  }


  goArena1vs1(room: string){
    this.pvpService.room = room;
    this.pvpService.joinRoom(room);
  }


}
