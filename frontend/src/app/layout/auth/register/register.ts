import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name=''; email=''; password=''; msg='';
  constructor(private _authS: AuthService, private _router: Router) {}
  submit() {
    this._authS.register({ name: this.name, email: this.email, password: this.password })
      .subscribe({ next: () => this._router.navigate(['/auth/login']), error: () => this.msg='Failed' });
  }
}
