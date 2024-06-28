import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref, set, update } from 'firebase/database';
import { IUser } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private firebaseConfig = {
    apiKey: 'AIzaSyBn7Xsl8J78W5D0cNTfgbKo3rGt1saIYDM',
    authDomain: 'pokemonmichael-7acf3.firebaseapp.com',
    databaseURL:'https://pokemonmichael-7acf3-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'pokemonmichael-7acf3',
    storageBucket: 'pokemonmichael-7acf3.appspot.com',
    messagingSenderId: '278125586111',
    appId: '1:278125586111:web:46fed5f40bab8fed20880a',
  };

  private app = initializeApp(this.firebaseConfig);
  private db = getDatabase(this.app);
  public userLogged: IUser | undefined;

  constructor(){}

  async writeUserData(name: string, points: number): Promise<void> {
    await set(ref(this.db, 'users/' + name), {
      userName: name,
      points: points,
    });
  }
  async getUser(userName: string): Promise<IUser | null> {
    try {
      const response = await get(child(ref(this.db), `users/${userName}`));
      if (response.exists()) {
        return response.val();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  async getAllUsers(): Promise<IUser[]> {
    const response = await get(child(ref(this.db), 'users'));
    if (response.exists()) {
      return Object.values(response.val());
    } else {
      return [];
    }
  }

  async updateUserPoints(userName: string, initialPoints: number): Promise<void> {
    const user = await this.getUser(userName);
    if (user) {
      const newPoints = user.points + initialPoints;
      await update(ref(this.db, 'users/' + userName), { points: newPoints });
    }
  }

  logOut() {
    this.userLogged = undefined;
  }

  logIn(user: IUser) {
    this.userLogged = user;
  }
}
