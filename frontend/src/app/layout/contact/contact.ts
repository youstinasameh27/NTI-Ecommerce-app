import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  name = ''; email = ''; phone = ''; category: 'complain' | 'question' = 'question'; message = ''; msg = '';
  sending = false;

  constructor(private _contactS: ContactService) {}

  send() {
    if (!this.name || !this.email || !this.message) {
      this.msg = 'Please fill name, email, and message.';
      return;
    }
    this.sending = true; this.msg = '';
    this._contactS.send({
      name: this.name,
      email: this.email,
      phone: this.phone || undefined,
      category: this.category,
      message: this.message
    }).subscribe({
      next: (res: any) => { this.sending = false; this.msg = res?.message || 'Sent'; this.reset(); },
      error: (e) => { this.sending = false; this.msg = e?.error?.message || 'Failed'; }
    });
  }

  private reset() { this.name=''; this.email=''; this.phone=''; this.category='question'; this.message=''; }
}
