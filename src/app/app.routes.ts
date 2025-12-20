import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'experiences',
    loadComponent: () => import('./pages/experiences/experiences.component').then(m => m.ExperiencesComponent)
  },
  {
    path: 'circuits',
    loadComponent: () => import('./pages/circuits/circuits.component').then(m => m.CircuitsComponent)
  },
  {
    path: 'booking/:circuitId',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'why-nio-far',
    loadComponent: () => import('./pages/why-nio-far/why-nio-far.component').then(m => m.WhyNioFarComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
