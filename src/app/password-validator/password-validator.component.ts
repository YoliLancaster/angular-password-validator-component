import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-validator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './password-validator.component.html',
  styleUrl: './password-validator.component.css',
})
export class PasswordValidatorComponent implements OnInit {
  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, this.passwordStrengthValidator]],
  });

  passwordDetails: string = ''; // Variable to hold password details
  message: string = '';
  colorClass: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      passwordControl.valueChanges.subscribe(() => {
        this.passwordStrengthValidator(passwordControl);
      });
    }
  }

  passwordStrengthValidator(control: AbstractControl) {
    const password: string = control.value;
    if (!password) {
      return { passwordStrength: true }; // Consider empty field as weak
    }

    const lengthValid = password.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    if (!lengthValid) {
      return { passwordStrength: true }; // Less than 8 characters is weak
    }

    if (
      (hasLetters && hasDigits && hasSymbols) ||
      (hasLetters && hasSymbols) ||
      (hasLetters && hasDigits) ||
      (hasDigits && hasSymbols)
    ) {
      return null; // Strong password
    } else {
      return { passwordStrength: true }; // Medium password
    }
  }

  onPasswordChange() {
    this.updatePasswordStrength();
  }

  updatePasswordStrength() {
    const passwordControl = this.form.get('password');

    if (passwordControl) {
      const password = passwordControl.value;

      if (!password) {
        this.message = 'Type your password';
        this.colorClass = 'mb-1 text-base font-medium';
      } else if (
        password.length >= 1 &&
        password.length < 8 &&
        (/^[a-zA-Z]+$/.test(password) ||
          /^\d+$/.test(password) ||
          /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(password))
      ) {
        this.message = 'Your password is weak';
        this.colorClass = 'text-red-700 dark:text-red-500';
      } else if (
        password.length >= 1 &&
        password.length < 8 &&
        (/^[a-zA-Z]+\d+$/.test(password) ||
          /^[a-zA-Z]+[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(password) ||
          /^\d+[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(password))
      ) {
        this.message = 'Your password is medium';
        this.colorClass = 'text-yellow-700 dark:text-yellow-500';
      } else if (
        password.length >= 8 &&
        /\d/.test(password) &&
        /[a-zA-Z]/.test(password) &&
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
      ) {
        this.message = 'Your password is strong';
        this.colorClass = 'text-green-700 dark:text-green-500';
      }
    }
  }
}
