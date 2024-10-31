import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../users/user.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-userform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss'],
})
export class UserformComponent implements OnInit, OnDestroy {
  @Input() componentData!: User | null;
  userForm!: FormGroup;
  nextUserId: number = 0;
  usersListObservable: any;
  disableFormSubmit = false;
  disableFormFields = false;
  showPreloader = false;

  @Output() closeModal = new EventEmitter<void>();

  private shouldValidateUserName = true;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.disableFormFields = true;

    this.usersListObservable = this.userService.usersListObservable.subscribe(
      (users) => {
        this.nextUserId = users?.length + 1 || 0;
        this.disableFormFields = false;
      }
    );

    this.userForm = this.formBuilder.group({
      id: [this.componentData?.id || this.nextUserId],
      userName: [
        {
          value: this.componentData?.userName || null,
          disabled: false,
        },
        {
          validators: [Validators.required, Validators.minLength(3)],
          asyncValidators: [
            this.checkUserNameUnique(this.componentData?.userName || ''),
          ],
          updateOn: 'blur',
        },
      ],
      active: [this.componentData?.active || false],
    });

    this.userService.getUsers();
  }

  ngOnDestroy(): void {
    this.componentData = null;
    if (this.usersListObservable) {
      this.usersListObservable.unsubscribe();
    }
  }

  checkUserNameUnique(existingUserName: string | null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      this.disableFormSubmit = true;
      this.showPreloader = true;
      if (existingUserName && control.value === existingUserName) {
        this.disableFormSubmit = false;
        this.showPreloader = false;
        return of(null);
      }

      if (!control.value) {
        this.disableFormSubmit = false;
        this.showPreloader = false;
        return of(null);
      }

      if (!this.shouldValidateUserName) {
        this.disableFormSubmit = false;
        this.showPreloader = false;
        return of(null);
      }

      this.shouldValidateUserName = false;

      control.disable();

      return from(
        this.userService.checkUserNameForUniqueness(control.value)
      ).pipe(
        map((isUnique) => {
          control.enable();
          this.shouldValidateUserName = true;
          this.disableFormSubmit = false;
          this.showPreloader = false;
          if (isUnique) {
            return null;
          } else {
            control.setErrors({ userNameTaken: true });
            return { userNameTaken: true };
          }
        }),
        catchError(() => {
          control.enable();
          this.disableFormSubmit = false;
          this.shouldValidateUserName = true;
          this.showPreloader = false;
          return of(null);
        })
      );
    };
  }

  userFormSubmitted() {
    this.disableFormSubmit = true;
    this.disableFormFields = true;
    if (this.userForm.valid) {
      this.userService.insertUpdateUser(this.userForm.value).then(() => {
        this.closeModal.emit();
      });
    }
  }
}
