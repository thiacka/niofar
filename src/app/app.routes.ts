import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
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
    path: 'excursions',
    loadComponent: () => import('./pages/excursions/excursions.component').then(m => m.ExcursionsComponent)
  },
  {
    path: 'circuits',
    loadComponent: () => import('./pages/circuits/circuits.component').then(m => m.CircuitsComponent)
  },
  {
    path: 'circuits/:slug',
    loadComponent: () => import('./pages/circuit-detail/circuit-detail.component').then(m => m.CircuitDetailComponent)
  },
  {
    path: 'booking/:circuitId',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'confirmation/:reference',
    loadComponent: () => import('./pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },
  {
    path: 'booking-lookup',
    loadComponent: () => import('./pages/booking-lookup/booking-lookup.component').then(m => m.BookingLookupComponent)
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
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
