import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-battle-result-modal',
  standalone: true,
  imports: [],
  templateUrl: './battle-result-modal.component.html',
  styleUrl: './battle-result-modal.component.css',
})
export class BattleResultModalComponent {
  @Input() result: string = '';


  constructor(private router: Router) {}

  goHome() {
    this.router.navigateByUrl('/');
  }
}
