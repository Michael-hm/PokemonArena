import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { IAttackPokemon } from '../../../interfaces/pokeApi.model';
import { Router } from '@angular/router';
import { TranslationService } from '../../../services/tranlation.service'; 
import { PvpService } from '../../../services/pvp.service';

@Component({
  selector: 'app-battle-menu',
  standalone: true,
  imports: [],
  templateUrl: './battle-menu.component.html',
  styleUrl: './battle-menu.component.css',
})
export class BattleMenuComponent implements OnInit{
  @Input() myMoves?: IAttackPokemon[] = [];
  @Input() isInFight: boolean = false;
  @Input() isPvp: boolean = false;
  @Output() public attackEvent: EventEmitter<IAttackPokemon> = new EventEmitter();
  translations: any;


  constructor(private router: Router, private translationService: TranslationService, private pvpService: PvpService) {

  }
   async ngOnInit(): Promise<void> {
      this.translations =  await this.translationService.getText();
  }

  attackEnemy(attack: IAttackPokemon): void {
    if(this.isPvp){
      this.pvpService.sendAttack(attack);
    }
    this.attackEvent.emit(attack);
  }

  switchMenu() {
    this.isInFight = !this.isInFight;
  }

  goBack() {
    this.router.navigateByUrl('');
  }
}
