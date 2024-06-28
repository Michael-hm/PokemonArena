import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public currentLang: string = 'es';

  constructor(private http: HttpClient) { }

  setLanguage(lang: string): void {
    this.currentLang = lang;
  }

  async getText(): Promise<any> {
    const filePath = `/assets/${this.currentLang}.json`;
    return await firstValueFrom(this.http.get(filePath));
  }

}
