import { Component, OnInit } from '@angular/core';
import { PvpService } from '../../../shared/pvp.service';
import { PokemonService } from '../../../shared/pokemon.service';
import { IAttackPokemon, IPokemon } from '../../../interfaces/pokeApi.model';
import { SessionService } from '../../../shared/session.service';
import { typeEffectiveness } from '../typeEffectiveness';
import { BattleMenuComponent } from '../battle-menu/battle-menu.component';
import { ScoringComponent } from '../../scoring/scoring.component';
import { PokemonInfoComponent } from '../pokemon-info/pokemon-info.component';
import { BattleResultModalComponent } from '../battle-result-modal/battle-result-modal.component';

@Component({
  selector: 'app-battle-arena-multiplayer',
  standalone: true,
  templateUrl: './battle-arena-multiplayer.component.html',
  styleUrl: './battle-arena-multiplayer.component.css',
  imports: [
    BattleMenuComponent,
    ScoringComponent,
    PokemonInfoComponent,
    BattleResultModalComponent,
  ],
})
export class BattleArenaMultiplayerComponent implements OnInit {
  public player1: IPokemon = { hp: 0, currenHp: 0, types: [] };
  public player2: IPokemon = { hp: 0, currenHp: 0, types: [] };
  public playerTurn: boolean = true;
  public player: 1 | 2;
  result: string = '';
  showModal: boolean = false;
  public isAllyAttacking: boolean = false;
  public isEnemyAttacking: boolean = false;

  constructor(
    private pvpService: PvpService,
    private pokemonService: PokemonService,
    private sessionService: SessionService
  ) {}
  async ngOnInit(): Promise<void> {
    this.player = this.pvpService.player;
    this.pvpService.getAttack().subscribe((attack) => {console.log(attack)});
    try {
      await this.fetchPokemons();
      this.determineFirstTurn();
    } catch (error) {
      console.log(error);
    }
  }

  async fetchPokemons(): Promise<void> {
    if(this.player === 1){
      const player1Id = Math.floor(Math.random() * 100);
      const player2Id = Math.floor(Math.random() * 100);
      const [player1, player2] = await Promise.all([
      this.pokemonService.getPokemonById(player1Id),
      this.pokemonService.getPokemonById(player2Id),
    ]);
    this.player1 = player1;
    this.player2 = player2;
    this.player1.hp = player1.stats[0].base_stat * 5;
    this.player2.hp = player2.stats[0].base_stat * 5;
    this.player1.currenHp = this.player1?.hp;
    this.player2.currenHp = this.player2?.hp;
    this.player1.sprite_back_default = player1.sprites.back_default;
    this.player1.sprite_front_default = player1.sprites.front_default;
    this.player2.sprite_front_default = player2.sprites.front_default;
    this.player2.sprite_back_default = player2.sprites.back_default;
    this.player1.selectedMoves = await this.pokemonService.getMoves(
      this.player1.moves
    );
    this.player2.selectedMoves = await this.pokemonService.getMoves(
      this.player2.moves
    );
    this.player1.types = this.player1.types?.map(
      (value) => value.type.name
    );
    this.player2.types = this.player2.types?.map(
      (value) => value.type.name
    );
      this.pvpService.sendPokemons({player1: this.player1, player2: this.player2 });
    }else{
      this.player1 = this.pvpService.pokemons.player2
      this.player2 = this.pvpService.pokemons.player1
    }
  }

  determineFirstTurn() {
    this.playerTurn = Math.random() < 0.5;
    if (!this.playerTurn) {
      setTimeout(() => {
        this.checkBattleStatus();
      }, 1000);
    }
    this.playerTurn = true;
  }
  checkBattleStatus() {
    if (this.player2.currenHp === 0) {
      this.result = '¡HAS GANADO!';
      this.showModal = true;
      this.updatePlayerPoints();
    } else if (this.player1.currenHp === 0) {
      this.result = '¡HAS PERDIDO!';
      this.showModal = true;
    }
  }
  computeMove(attack: IAttackPokemon) {
    if (attack && attack.power) {
      const multiplier = this.getDamageMultiplier(
        attack.type,
        this.player2.types
      );
      this.isAllyAttacking = true;
      this.player2.currenHp =
        this.player2.currenHp - attack.power * multiplier < 0
          ? 0
          : this.player2.currenHp - attack.power * multiplier;
    }
    setTimeout(() => {
      if (this.player2.currenHp !== 0) { 
        this.checkBattleStatus();
        this.isAllyAttacking = false;
      } 
    }, 1500);

    this.playerTurn = false;
  }

  resetBattle() {
    this.result = '';
  }
  getDamageMultiplier(
    attackType: string,
    targetTypes: string[] | undefined
  ): number {
    let multiplier = 1;
    if (!targetTypes) {
      return multiplier;
    }
    for (const targetType of targetTypes) {
      multiplier *= typeEffectiveness?.[attackType]?.[targetType] ?? 1;
    }
    return multiplier;
  }

  async updatePlayerPoints(): Promise<void> {
    if (this.sessionService.userLogged) {
      const damageCount = this.player2.hp - this.player2.currenHp;
      const initialPoints = 3000 + damageCount;
      await this.sessionService.updateUserPoints(
        this.sessionService.userLogged.userName,
        initialPoints
      );
    }
  }
}
