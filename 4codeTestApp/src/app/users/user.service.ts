import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

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

  getUsers(): Promise<User[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.usersListObservable.next(usersList);
        resolve(usersList);
      }, environment.serverEmulation)
    );
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

  checkUserNameForUniqueness(user_name: string): Promise<boolean> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const isUnique = !usersList.some((user) => user.userName === user_name);
        resolve(isUnique);
      }, environment.serverEmulation)
    );
  }

  deleteUser(deletingUser: User): Promise<User[]> {
    let newUsersList = usersList.filter((user) => user.id != deletingUser.id);
    usersList = newUsersList;
    return this.getUsers();
  }
}
