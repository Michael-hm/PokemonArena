import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../interfaces/pokeApi.model';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.css']
})
export class PokemonInfoComponent {
  @Input() public isYourPokemon: boolean = false;
  @Input() public pokemon: IPokemon = { name: '', id: 0, hp: 0, currenHp: 0, sprite_back_default: '', sprite_front_default: '', moves: [] };
  @Input() public isAllyAttacking: boolean = false;
  @Input() public isEnemyAttacking: boolean = false;

  getHpPercentage(): number {
    const actualHp = (this.pokemon?.currenHp / this.pokemon?.hp) * 100;
    return actualHp >= 0 ? actualHp : 0;
  }
}
