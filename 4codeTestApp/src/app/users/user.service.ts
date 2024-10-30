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
    return new Promise(() =>
      setTimeout(() => {
        this.usersListObservable.next(usersList);
      }, environment.severEmulation)
    );
  }

  updateUser(editedUser: User): Promise<User[]> {
    usersList.map((user) => {
      if (user.id === editedUser.id) {
        user.active = editedUser.active;
        user.userName = editedUser.userName;
      }
    });
    return this.getUsers();
  }

  checkUserNameForUniqueness(user_name: string): Promise<boolean> {
    return new Promise(() =>
      setTimeout(() => {
        let matching_result =
          usersList.filter((user) => user.userName === user_name).length > 0
            ? false
            : true;
        return matching_result;
      }, environment.severEmulation)
    );
  }
}
