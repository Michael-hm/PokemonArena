import { Component, OnInit } from '@angular/core';
import { PokemonInfoComponent } from './pokemon-info/pokemon-info.component';
import { BattleMenuComponent } from './battle-menu/battle-menu.component';
import { PokemonService } from '../../shared/pokemon.service';
import { IAttackPokemon, IPokemon } from '../../interfaces/pokeApi.model';
import { BattleResultModalComponent } from './battle-result-modal/battle-result-modal.component';
import { Router } from '@angular/router';
import { ScoringComponent } from '../scoring/scoring.component';
import { typeEffectiveness } from './typeEffectiveness';
import { SessionService } from '../../shared/session.service';

@Component({
  selector: 'app-battle-arena',
  standalone: true,
  templateUrl: './battle-arena.component.html',
  styleUrl: './battle-arena.component.css',
  imports: [
    PokemonInfoComponent,
    BattleMenuComponent,
    BattleResultModalComponent,
    ScoringComponent,
  ],
})
export class BattleArenaComponent implements OnInit {
  public allyPokemon: IPokemon = { hp: 0, currenHp: 0, types: [] };
  public enemyPokemon: IPokemon = { hp: 0, currenHp: 0, types: [] };
  public playerTurn: boolean = true;
  result: string = '';
  showModal: boolean = false;
  public isAllyAttacking: boolean = false;
  public isEnemyAttacking: boolean = false;

  constructor(private pokemonService: PokemonService, private router: Router, private sessionService: SessionService) {}
  async ngOnInit(): Promise<void> {
    try {
      await this.fetchPokemons();
      this.determineFirstTurn();
    } catch (error) {
      console.log(error);
    }
  }

  async fetchPokemons(): Promise<void> {
    const allyPokemonId = Math.floor(Math.random() * 100);
    const enemyPokemonId = Math.floor(Math.random() * 100);
    const [allyPokemon, enemyPokemon] = await Promise.all([
      this.pokemonService.getPokemonById(allyPokemonId),
      this.pokemonService.getPokemonById(enemyPokemonId),
    ]);
    this.allyPokemon = allyPokemon;
    this.enemyPokemon = enemyPokemon;
    this.allyPokemon.hp = allyPokemon.stats[0].base_stat * 5;
    this.enemyPokemon.hp = enemyPokemon.stats[0].base_stat * 5;
    this.allyPokemon.currenHp = this.allyPokemon?.hp;
    this.enemyPokemon.currenHp = this.enemyPokemon?.hp;
    this.allyPokemon.sprite_back_default = allyPokemon.sprites.back_default;
    this.enemyPokemon.sprite_front_default = enemyPokemon.sprites.front_default;
    this.allyPokemon.selectedMoves = await this.pokemonService.getMoves(
      this.allyPokemon.moves
    );
    this.enemyPokemon.selectedMoves = await this.pokemonService.getMoves(
      this.enemyPokemon.moves
    );
    this.allyPokemon.types = this.allyPokemon.types?.map(
      (value) => value.type.name
    );
    this.enemyPokemon.types = this.enemyPokemon.types?.map(
      (value) => value.type.name
    );
  }

  determineFirstTurn() {
    this.playerTurn = Math.random() < 0.5;
    if (!this.playerTurn) {
      setTimeout(() => {
        this.enemyAttack();
        this.checkBattleStatus();
      }, 1000);
    }
    this.playerTurn = true;
  }
  enemyAttack() {
    if (this.enemyPokemon.selectedMoves?.length) {
      const randomIndex = Math.floor(
        Math.random() * this.enemyPokemon.selectedMoves.length
      );
      const attack = this.enemyPokemon.selectedMoves[randomIndex];
      if (attack?.power) {
        const multiplier = this.getDamageMultiplier(
          attack.type,
          this.enemyPokemon.types
        );
        this.isEnemyAttacking = true;
        this.allyPokemon.currenHp = Math.max(
          0,
          this.allyPokemon.currenHp - attack.power * multiplier
        );
      }
      setTimeout(() => {
        this.isEnemyAttacking = false;
      }, 1500);
    }
  }
  checkBattleStatus() {
    if (this.enemyPokemon.currenHp === 0) {
      this.result = '¡HAS GANADO!';
      this.showModal = true;
      this.updatePlayerPoints();
    } else if (this.allyPokemon.currenHp === 0) {
      this.result = '¡HAS PERDIDO!';
      this.showModal = true;
    }
  }
  computeMove(attack: IAttackPokemon) {
    if (attack && attack.power) {
      const multiplier = this.getDamageMultiplier(
        attack.type,
        this.enemyPokemon.types
      );
      this.isAllyAttacking = true;
      this.enemyPokemon.currenHp =
        this.enemyPokemon.currenHp - attack.power * multiplier < 0
          ? 0
          : this.enemyPokemon.currenHp - attack.power * multiplier;
    }
    setTimeout(() => {
      if (this.enemyPokemon.currenHp !== 0) {
        this.enemyAttack();
      }
      this.checkBattleStatus();
      this.isAllyAttacking = false;
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
      const damageCount = this.enemyPokemon.hp - this.enemyPokemon.currenHp;
      const initialPoints = 1000 + damageCount;
      await this.sessionService.updateUserPoints(
        this.sessionService.userLogged.userName,
        initialPoints
      );
    }
  }
}
