import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IAttackPokemon } from '../interfaces/pokeApi.model';

@Injectable({
  providedIn: 'root'
})
export class PvpService {
  private socket: Socket;
  public room: string;
  public player: 1 | 2;
  public pokemons: any;

  constructor() {
    this.socket = io('http://localhost:3000');
  }
  
  joinRoom(room: string): void {
    this.socket.emit('joinRoom', room);
  }

  sendAttack( attack: IAttackPokemon): void {
    this.socket.emit('attack', { room:this.room, attack, player:this.player + '' });
  }

  getAttack(): Observable<{player: string, attack: IAttackPokemon}> {
    return new Observable(observer => {
      this.socket.on('reciveAttack', (response: {player: string, attack: IAttackPokemon}) => {
        observer.next(response);
      });
    });
  }

  getRoomStatus(): Observable<{success: boolean, message: string, isRoomFull: boolean, pokemons?: any}> {
    return new Observable(observer => {
      this.socket.on('roomJoined', (response: {success: boolean, message: string, isRoomFull: boolean, pokemons?: any}) => {
        observer.next(response);
      });
    });
  }

  sendPokemons( pokemons: any): void {
    this.socket.emit('loadPokemon', { room:this.room, pokemons });
  }
  
}
