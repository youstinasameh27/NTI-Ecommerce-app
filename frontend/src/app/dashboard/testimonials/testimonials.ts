import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialService } from '../../core/services/testimonial.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials implements OnInit {
  items:any[]=[]; loading=false;
  constructor(private _t: TestimonialService){}
  ngOnInit(){
     this.load(); 
    }
  load(){
     this.loading=true; this._t.pending().subscribe({ next:(r:any)=>{ this.items = r?.data || r || []; this.loading=false; }, 
     error:()=>{ this.items=[]; this.loading=false; } });
     }
  approve(t:any){
     this._t.approve(t._id || t.id).subscribe(()=> this.load()); 
    }
  remove(t:any){ 
    this._t.remove(t._id || t.id).subscribe(()=> this.load());
   }
}
