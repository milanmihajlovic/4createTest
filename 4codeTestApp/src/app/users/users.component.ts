import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from './user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
  usersList: User[] = [];
  usersListObservable: any;
  renderUsersList = false;
  updatingUsersList = false;
  addUserDisabled = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
    this.usersListObservable = this.userService.usersListObservable.subscribe(
      (users) => {
        this.usersList = users;
        this.renderUsersList = this.usersList.length > 0 ? true : false;
        this.updatingUsersList = false;

        this.addUserDisabled =
          this.usersList.length < environment.maxUserCount &&
          this.allUsersAreActive()
            ? false
            : true;
      }
    );
  }

  ngOnDestroy() {
    this.usersListObservable.unsubscribe();
  }

  async loadUsers() {
    this.renderUsersList = false;
    this.userService.getUsers();
  }

  toggleActive(user: User) {
    let updatedUser = { ...user };
    updatedUser.active = !updatedUser.active;
    this.updatingUsersList = true;
    this.userService.updateUser(updatedUser);
  }

  allUsersAreActive() {
    return (
      this.usersList.length ===
      this.usersList.filter((user) => user.active).length
    );
  }
}