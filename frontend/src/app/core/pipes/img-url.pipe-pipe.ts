import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'imgUrl', standalone: true })
export class ImgUrlPipe implements PipeTransform {
  transform(v?: string): string {
    if (!v) return '';

    let path = v.trim().replace(/\\/g, '/');

    if (/^https?:\/\//i.test(path)) return path;

    if (path.startsWith('/uploads/')) {
      const root = environment.apiURL.replace(/\/api\/?$/, ''); 
      return root + path;                                       
    }

    if (path.startsWith('uploads/')) {
      return `${environment.uploadsURL}/${path.substring(8)}`;  
    }

    return `${environment.uploadsURL}/${path}`;
  }
}
