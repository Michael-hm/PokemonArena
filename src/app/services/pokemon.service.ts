import { Injectable } from '@angular/core';
import Pokedex from 'pokedex-promise-v2';
import { IAttackPokemon } from '../interfaces/pokeApi.model';
import { TranslationService } from './tranlation.service';


@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  P: Pokedex;
  constructor(private translationService: TranslationService) {
    this.P = new Pokedex();
  }

  getPokemonById(id: number): Promise<any> {
    return this.P.getPokemonByName(id);
  }

  async getMoveByName(attackName: string) {
    return await this.P.getMoveByName(attackName);
  }

  async getMoves(moves?: Pokedex.MoveElement[]): Promise<IAttackPokemon[]> {
    let resultMoves: IAttackPokemon[] = [];

    if (moves) {
      for (let i = 0; i < 4; i++) {
        let random: number = Math.floor(Math.random() * moves.length);
        if (
          resultMoves.length > 0 &&
          resultMoves.find((move) => move.name == moves[random].move.name)

        ) {
          i--;
        } else {
          resultMoves.push(await this.formatAttack(moves[random].move.name));
        }
      }
    }
    return resultMoves;
  }

  async formatAttack(attackName: string) {
    const attackData = await this.getMoveByName(attackName);
    const attackFormated: IAttackPokemon = {
      type: attackData.type.name,
      power: attackData.power,
      name: attackData.names.filter(
        (name) => name.language.name === this.translationService.currentLang
      )[0].name,
    };
    return attackFormated;
  }
}
