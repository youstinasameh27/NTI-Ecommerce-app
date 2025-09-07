import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  animations: [
    trigger('fade', [ transition(':enter', [ style({opacity:0, transform:'translateY(8px)'}), animate('160ms ease-out', style({opacity:1, transform:'none'})) ]) ])
  ],
  host: { '[@fade]': '' }
})
export class Login {
  email=''; password=''; msg='';
  constructor(private _authS: AuthService, private _router: Router) {}
  submit() {
    this._authS.login({ email: this.email, password: this.password }).subscribe({
      next: () => this._router.navigate([ this._authS.isAdmin() ? '/dashboard/home' : '/home' ]),
      error: (e) => this.msg = (e?.error?.message || 'Login failed')
    });
  }
}
