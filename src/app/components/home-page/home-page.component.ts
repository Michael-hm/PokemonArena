import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../shared/session.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { TranslationService } from '../../shared/tranlation.service';
import { ModalRoomComponent } from '../modal-room/modal-room.component';




@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, LoginModalComponent,ModalRoomComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})

export class HomePageComponent implements OnInit{
  translations: any;
  selectedLang: string = this.translationService.currentLang;
  isUserLogged: boolean = false;
  showRoomModal: boolean = false

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private sessionService: SessionService
  ){}

  async ngOnInit(): Promise<void> {
    this.translations =  await this.translationService.getText();
    this.isUserLogged = this.sessionService.userLogged !== undefined
  }

  goArenaCom(){
    this.router.navigateByUrl('battle-arena')
  }

  goArena1vs1(){
    this.router.navigateByUrl('battle-arena-multiplayer')
  }

  changeLang(): void {
    this.translationService.setLanguage(this.selectedLang);
    this.translationService.getText().then((tra)=>{this.translations = tra})
  }

  logUser(){
    this.isUserLogged = true;
  }

  showRoom(){
    this.showRoomModal = true;
  }
}
