import Pokedex from 'pokedex-promise-v2';

export interface IPokemonApiOptions {
    protocol?: 'https' | 'http';
    hostName?: string;
    versionPath?: string;
    offset?: number;
    limit?: number;
    timeout?: number;
    cacheLimit?: number;
}

export interface IPokemon {
    id?: number;
    name?: string;
    hp: number;
    currenHp: number;
    sprite_front_default?: string | null;
    sprite_back_default?: string | null;
    moves?: Pokedex.MoveElement[];
    selectedMoves?: IAttackPokemon[];
    types?: any[];
}

export interface IAttackPokemon {
    type: string;
    power: number | null;
    name: string;
}
