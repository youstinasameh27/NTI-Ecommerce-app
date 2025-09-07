import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(public _authS: AuthService, private _router: Router) {}
  logout() { this._authS.logout(); this._router.navigate(['/home']); }
}
