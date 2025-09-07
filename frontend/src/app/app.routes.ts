import { Routes } from '@angular/router';

import { Layout } from './layout/layout/layout';
import { Home } from './layout/home/home';
import { Products } from './layout/products/products';
import { Product } from './layout/product/product';
import { Login } from './layout/auth/login/login';
import { Register } from './layout/auth/register/register';

import { Cart } from './layout/cart/cart';
import { Profile } from './layout/profile/profile';
import { About } from './layout/about/about';
import { Faq } from './layout/faq/faq';
import { Contact } from './layout/contact/contact';

import { Dashboard } from './dashboard/dashboard';
import { Home as DashboardHome } from './dashboard/home/home';
import { Orders as DashboardOrders } from './dashboard/orders/orders';
import { Products as DashboardProducts } from './dashboard/products/products';
import { Categories as DashboardCategories } from './dashboard/categories/categories';
import { Testimonials as DashboardTestimonials } from './dashboard/testimonials/testimonials';
import { Reports as DashboardReports } from './dashboard/reports/reports';
import { Content as DashboardContent } from './dashboard/content/content';
import { Edit as DashboardEdit } from './dashboard/edit/edit';

import { adminGuardGuard } from './core/guards/admin-guard-guard';
import { authGuardGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'products', component: Products },
      { path: 'product/:route', component: Product },
      { path: 'cart', component: Cart, canActivate: [authGuardGuard] },
      { path: 'profile', component: Profile, canActivate: [authGuardGuard] },

{ path: 'about', loadComponent: () => import('./layout/about/about').then(m => m.About) },
{ path: 'faq',   loadComponent: () => import('./layout/faq/faq').then(m => m.Faq) },

{ path: 'dashboard/content', canActivate: [adminGuardGuard], loadComponent: () => import('./dashboard/content/content').then(m => m.Content) },

      { path: 'contact', component: Contact },
      { path: 'auth/login', component: Login },
      { path: 'auth/register', component: Register }
    ]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuardGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHome },
      { path: 'orders', component: DashboardOrders },
      { path: 'products', component: DashboardProducts },
      { path: 'categories', component: DashboardCategories },
      { path: 'testimonials', component: DashboardTestimonials },
      { path: 'reports', component: DashboardReports },
      { path: 'content', component: DashboardContent },
      { path: 'edit/:id', component: DashboardEdit }
    ]
  },
  { path: '**', redirectTo: '' }
];
