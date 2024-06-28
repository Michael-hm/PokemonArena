import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BattleArenaComponent } from './components/battle-arena/battle-arena.component';
import { WaitingRoomsComponent } from './components/waiting-rooms/waiting-rooms.component';
import { BattleArenaMultiplayerComponent } from './components/battle-arena/battle-arena-multiplayer/battle-arena-multiplayer.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'battle-arena', component: BattleArenaComponent },
  { path: 'waiting-rooms', component: WaitingRoomsComponent },
  { path: 'battle-arena-multiplayer', component: BattleArenaMultiplayerComponent},
  { path: 'battle-arena-multiplayer/:room', component: BattleArenaMultiplayerComponent}
];
