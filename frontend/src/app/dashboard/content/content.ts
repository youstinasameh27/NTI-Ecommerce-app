import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutService } from '../../core/services/about.service';
import { FaqService } from '../../core/services/faq.service';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.html',
  styleUrl: './content.css'
})
export class Content implements OnInit {
  // About
  aboutTitle = 'Youstina Brand — About Us';
  aboutText = '';
  aboutMsg = '';
  aboutBusy = false;

  // FAQ
  faqs: any[] = [];
  faqMsg = '';
  faqBusy = false;

  // new FAQ form
  q = '';
  a = '';
  enabled = true;

  constructor(private _aboutS: AboutService, private _faqS: FaqService) {}

  ngOnInit(): void {
    this.loadAbout();
    this.loadFaqs();
  }

  // About
  loadAbout() {
    this._aboutS.get().subscribe({
      next: (r: any) => {
        const d = r?.data || r;
        this.aboutTitle = d?.title || 'Youstina Brand — About Us';
        this.aboutText = d?.content || '';
      },
      error: () => { this.aboutMsg = 'Failed to load about'; }
    });
  }

  saveAbout() {
    this.aboutBusy = true;
    this._aboutS.set({ title: this.aboutTitle, content: this.aboutText }).subscribe({
      next: () => { this.aboutBusy = false; this.aboutMsg = 'Saved'; },
      error: () => { this.aboutBusy = false; this.aboutMsg = 'Failed'; }
    });
  }

  // FAQ
  loadFaqs() {
    this.faqBusy = true;
    this._faqS.list().subscribe({
      next: (r: any) => {
        this.faqs = r?.data || r || [];
        this.faqBusy = false;
      },
      error: () => { this.faqBusy = false; this.faqMsg = 'Failed to load FAQ'; }
    });
  }

  addFaq() {
    if (!this.q || !this.a) { this.faqMsg = 'Question and answer are required'; return; }
    this._faqS.create({ question: this.q, answer: this.a, enabled: this.enabled }).subscribe({
      next: () => { this.q = ''; this.a = ''; this.enabled = true; this.loadFaqs(); },
      error: () => { this.faqMsg = 'Failed to add'; }
    });
  }

  toggleEnabled(item: any) {
    const flag = !item.enabled;
    this._faqS.update(item._id, { enabled: flag }).subscribe({
      next: () => { item.enabled = flag; },
      error: () => { this.faqMsg = 'Failed to update'; }
    });
  }

  saveFaq(item: any) {
    this._faqS.update(item._id, { question: item.question, answer: item.answer, enabled: item.enabled }).subscribe({
      next: () => {},
      error: () => { this.faqMsg = 'Failed to save'; }
    });
  }

  deleteFaq(item: any) {
    this._faqS.remove(item._id).subscribe({
      next: () => { this.faqs = this.faqs.filter(x => x._id !== item._id); },
      error: () => { this.faqMsg = 'Failed to delete'; }
    });
  }
}
