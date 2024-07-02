import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { TranslationService } from '../../services/tranlation.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})

export class LoginModalComponent {
  @Output() public loginEvent: EventEmitter<void> = new EventEmitter();
  translations: any = { name: '' };
  constructor(
    private translationService: TranslationService,
    private sessionService: SessionService,
  ) {}

  async ngOnInit(): Promise<void> {
    const text = await this.translationService.getText();
    this.translations = text.translate;
  }

  async logIn(name: string) {
    const user = await this.sessionService.getUser(name);
    if (user === null) {
      this.sessionService.writeUserData(name, 0);
      this.sessionService.logIn({
        userName: name,
        points: 0,
      });
    } else {
      this.sessionService.logIn(user);
    }
    this.loginEvent.emit();
  }
}
