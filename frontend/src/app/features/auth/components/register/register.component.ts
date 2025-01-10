import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
 import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

})
export class RegisterComponent {
  signupForm: FormGroup;

 constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
 )
 {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[^A-Za-z0-9]/), // At least one special character
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Extract form values
      const userData = this.signupForm.value;

      // Call the register method of AuthService
      this.authService.register(userData).subscribe(
        (response) => {
          // Redirect to login after successful registration
          this.toastr.success('Register successful!', 'Success');
          this.router.navigate(['/login']);
         
        },
       (error) => {
    // Check if the error indicates that the user already exists
    if (error.status === 409) { // Assuming 409 Conflict status code for existing user
      this.toastr.error('User already exists. Please use a different email.', 'Error');
    } else {
      // Handle other errors
      this.toastr.error('Registration failed. Please check your credentials and try again.', 'Error');
    }
    console.error('Registration failed', error);
  }
      );
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
