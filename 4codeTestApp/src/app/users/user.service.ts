import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, of, firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';

let usersList = [
  {
    id: 1,
    userName: 'Peter',
    active: false,
  },
  {
    id: 2,
    userName: 'Mike',
    active: false,
  },
  {
    id: 3,
    userName: 'John',
    active: false,
  },
  {
    id: 4,
    userName: 'Harvey',
    active: true,
  },
  {
    id: 5,
    userName: 'Ralph',
    active: false,
  },
];

export interface User {
  id: number;
  userName: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  public usersListObservable: BehaviorSubject<any> = new BehaviorSubject([]);

  async getUsers(): Promise<User[]> {
    const users = await firstValueFrom(
      of(usersList).pipe(delay(environment.serverEmulation))
    );

    this.usersListObservable.next(users);
    return users;
  }

  insertUpdateUser(editedUser: User): Promise<User[]> {
    let userUpdated = false;
    usersList.map((user) => {
      if (user.id === editedUser.id) {
        user.active = editedUser.active;
        user.userName = editedUser.userName;
        userUpdated = true;
      }
    });
    if (!userUpdated) {
      let newUser: User = {
        id: editedUser.id,
        userName: editedUser.userName,
        active: editedUser.active,
      };
      usersList.push(newUser);
    }
    return this.getUsers();
  }

  async checkUserNameForUniqueness(user_name: string): Promise<boolean> {
    const isUnique = !usersList.some((user) => user.userName === user_name);
    await firstValueFrom(of(isUnique).pipe(delay(environment.serverEmulation)));
    return isUnique;
  }

  deleteUser(deletingUser: User): Promise<User[]> {
    let newUsersList = usersList.filter((user) => user.id != deletingUser.id);
    usersList = newUsersList;
    return this.getUsers();
  }
}
