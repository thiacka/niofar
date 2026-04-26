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
    path: 'rentals',
    loadComponent: () => import('./pages/rentals/rentals.component').then(m => m.RentalsComponent)
  },
  {
    path: 'booking/:circuitId',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'excursion-booking/:excursionId',
    loadComponent: () => import('./pages/excursion-booking/excursion-booking.component').then(m => m.ExcursionBookingComponent)
  },
  {
    path: 'payment/:reference',
    loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent)
  },
  {
    path: 'confirmation/:reference',
    loadComponent: () => import('./pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },
  {
    path: 'rental-booking/:rentalSlug',
    loadComponent: () => import('./pages/rental-booking/rental-booking.component').then(m => m.RentalBookingComponent)
  },
  {
    path: 'transfer-booking',
    loadComponent: () => import('./pages/transfer-booking/transfer-booking.component').then(m => m.TransferBookingComponent)
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
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
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
    path: 'admin/set-password',
    loadComponent: () => import('./pages/set-password/set-password.component').then(m => m.SetPasswordComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
