import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AdminService, Booking, ContactMessage } from '../../core/services/admin.service';
import { CircuitService, Circuit } from '../../core/services/circuit.service';
import { LanguageService } from '../../core/services/language.service';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalMessages: number;
  totalCircuits: number;
  activeCircuits: number;
}

interface CircuitStats {
  slug: string;
  title: string;
  bookingsCount: number;
  revenue: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="dashboard">
      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().totalBookings }}</span>
              <span class="stat-label">{{ lang.t('dashboard.totalBookings') }}</span>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().confirmedBookings }}</span>
              <span class="stat-label">{{ lang.t('dashboard.confirmed') }}</span>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().pendingBookings }}</span>
              <span class="stat-label">{{ lang.t('dashboard.pending') }}</span>
            </div>
          </div>

          <div class="stat-card accent">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().totalRevenue | number }} <small>FCFA</small></span>
              <span class="stat-label">{{ lang.t('dashboard.totalRevenue') }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-card">
            <div class="card-header">
              <h3>{{ lang.t('dashboard.recentBookings') }}</h3>
            </div>
            <div class="card-body">
              @if (recentBookings().length === 0) {
                <div class="empty-state">
                  <p>{{ lang.t('dashboard.noRecentBookings') }}</p>
                </div>
              } @else {
                <div class="bookings-list">
                  @for (booking of recentBookings(); track booking.id) {
                    <div class="booking-item">
                      <div class="booking-info">
                        <span class="booking-name">{{ booking.first_name }} {{ booking.last_name }}</span>
                        <span class="booking-excursion">{{ booking.excursion_title }}</span>
                      </div>
                      <div class="booking-meta">
                        <span class="booking-date">{{ booking.start_date | date:'dd/MM/yyyy' }}</span>
                        <span class="booking-status" [class]="'status-' + booking.status">
                          {{ lang.t('admin.status.' + booking.status) }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>{{ lang.t('dashboard.bookingsByStatus') }}</h3>
            </div>
            <div class="card-body">
              <div class="status-chart">
                <div class="chart-bar">
                  <div class="bar-fill confirmed" [style.width.%]="getStatusPercentage('confirmed')"></div>
                  <div class="bar-fill pending" [style.width.%]="getStatusPercentage('pending')"></div>
                  <div class="bar-fill cancelled" [style.width.%]="getStatusPercentage('cancelled')"></div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-color confirmed"></span>
                    <span class="legend-label">{{ lang.t('dashboard.confirmed') }} ({{ stats().confirmedBookings }})</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color pending"></span>
                    <span class="legend-label">{{ lang.t('dashboard.pending') }} ({{ stats().pendingBookings }})</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color cancelled"></span>
                    <span class="legend-label">{{ lang.t('dashboard.cancelled') }} ({{ stats().cancelledBookings }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-card full-width">
            <div class="card-header">
              <h3>{{ lang.t('dashboard.popularCircuits') }}</h3>
            </div>
            <div class="card-body">
              @if (circuitStats().length === 0) {
                <div class="empty-state">
                  <p>{{ lang.t('dashboard.noCircuitData') }}</p>
                </div>
              } @else {
                <div class="circuits-table">
                  <div class="table-header">
                    <span>{{ lang.t('admin.circuit') }}</span>
                    <span>{{ lang.t('dashboard.bookingsCount') }}</span>
                    <span>{{ lang.t('dashboard.revenue') }}</span>
                  </div>
                  @for (circuit of circuitStats(); track circuit.slug) {
                    <div class="table-row">
                      <span class="circuit-name">{{ circuit.title }}</span>
                      <span class="circuit-bookings">{{ circuit.bookingsCount }}</span>
                      <span class="circuit-revenue">{{ circuit.revenue | number }} FCFA</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>{{ lang.t('dashboard.quickStats') }}</h3>
            </div>
            <div class="card-body">
              <div class="quick-stats">
                <div class="quick-stat">
                  <span class="quick-value">{{ stats().totalCircuits }}</span>
                  <span class="quick-label">{{ lang.t('dashboard.totalCircuits') }}</span>
                </div>
                <div class="quick-stat">
                  <span class="quick-value">{{ stats().activeCircuits }}</span>
                  <span class="quick-label">{{ lang.t('dashboard.activeCircuits') }}</span>
                </div>
                <div class="quick-stat">
                  <span class="quick-value">{{ stats().totalMessages }}</span>
                  <span class="quick-label">{{ lang.t('dashboard.messages') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>{{ lang.t('dashboard.recentMessages') }}</h3>
            </div>
            <div class="card-body">
              @if (recentMessages().length === 0) {
                <div class="empty-state">
                  <p>{{ lang.t('dashboard.noRecentMessages') }}</p>
                </div>
              } @else {
                <div class="messages-list">
                  @for (message of recentMessages(); track message.id) {
                    <div class="message-item">
                      <div class="message-info">
                        <span class="message-name">{{ message.name }}</span>
                        <span class="message-preview">{{ truncateMessage(message.message) }}</span>
                      </div>
                      <span class="message-date">{{ message.created_at | date:'dd/MM' }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--spacing-md) 0;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .stat-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card.primary .stat-icon {
      background: rgba(61, 43, 31, 0.1);
      color: var(--color-primary);
    }

    .stat-card.success .stat-icon {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
    }

    .stat-card.warning .stat-icon {
      background: rgba(196, 159, 74, 0.15);
      color: #b8860b;
    }

    .stat-card.accent .stat-icon {
      background: rgba(43, 138, 138, 0.15);
      color: var(--color-secondary);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text);
      line-height: 1.2;
    }

    .stat-value small {
      font-size: 0.6em;
      font-weight: 400;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--color-text-light);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .dashboard-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .dashboard-card.full-width {
      grid-column: 1 / -1;
    }

    .card-header {
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--color-text);
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text-light);
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .booking-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-md);
    }

    .booking-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .booking-name {
      font-weight: 600;
      color: var(--color-text);
    }

    .booking-excursion {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .booking-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .booking-date {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .booking-status {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .status-pending {
      background: rgba(196, 159, 74, 0.15);
      color: #b8860b;
    }

    .status-confirmed {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
    }

    .status-cancelled {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
    }

    .status-chart {
      padding: var(--spacing-md) 0;
    }

    .chart-bar {
      height: 24px;
      background: var(--color-background);
      border-radius: var(--radius-full);
      overflow: hidden;
      display: flex;
    }

    .bar-fill {
      height: 100%;
      transition: width 0.5s ease;
    }

    .bar-fill.confirmed {
      background: var(--color-success);
    }

    .bar-fill.pending {
      background: #b8860b;
    }

    .bar-fill.cancelled {
      background: var(--color-error);
    }

    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .legend-color.confirmed {
      background: var(--color-success);
    }

    .legend-color.pending {
      background: #b8860b;
    }

    .legend-color.cancelled {
      background: var(--color-error);
    }

    .legend-label {
      font-size: 0.85rem;
      color: var(--color-text);
    }

    .circuits-table {
      display: flex;
      flex-direction: column;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 1fr 120px 150px;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
    }

    .table-header {
      background: var(--color-background);
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table-row {
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .circuit-name {
      font-weight: 500;
      color: var(--color-text);
    }

    .circuit-bookings {
      text-align: center;
      color: var(--color-text-light);
    }

    .circuit-revenue {
      text-align: right;
      font-weight: 600;
      color: var(--color-secondary);
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .quick-stat {
      text-align: center;
      padding: var(--spacing-lg);
      background: var(--color-background);
      border-radius: var(--radius-lg);
    }

    .quick-value {
      display: block;
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1;
      margin-bottom: var(--spacing-xs);
    }

    .quick-label {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .message-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-md);
    }

    .message-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .message-name {
      font-weight: 600;
      color: var(--color-text);
    }

    .message-preview {
      font-size: 0.85rem;
      color: var(--color-text-light);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }

    .message-date {
      font-size: 0.8rem;
      color: var(--color-text-light);
      flex-shrink: 0;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-card.full-width {
        grid-column: 1;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr 80px 100px;
        font-size: 0.85rem;
      }

      .quick-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  lang = inject(LanguageService);
  private adminService = inject(AdminService);
  private circuitService = inject(CircuitService);

  isLoading = signal(true);
  stats = signal<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalMessages: 0,
    totalCircuits: 0,
    activeCircuits: 0
  });
  recentBookings = signal<Booking[]>([]);
  recentMessages = signal<ContactMessage[]>([]);
  circuitStats = signal<CircuitStats[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    this.isLoading.set(true);

    const [bookings, messages, circuits] = await Promise.all([
      this.adminService.getBookings(),
      this.adminService.getContactMessages(),
      this.circuitService.loadAllCircuits()
    ]);

    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.estimated_total, 0);

    this.stats.set({
      totalBookings: bookings.length,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      totalMessages: messages.length,
      totalCircuits: circuits.length,
      activeCircuits: circuits.filter(c => c.is_active).length
    });

    this.recentBookings.set(bookings.slice(0, 5));
    this.recentMessages.set(messages.slice(0, 5));

    const circuitBookings = new Map<string, { count: number; revenue: number }>();
    bookings.forEach(booking => {
      const existing = circuitBookings.get(booking.excursion_id) || { count: 0, revenue: 0 };
      existing.count++;
      if (booking.status === 'confirmed') {
        existing.revenue += booking.estimated_total;
      }
      circuitBookings.set(booking.excursion_id, existing);
    });

    const circuitStatsArray: CircuitStats[] = [];
    circuits.forEach(circuit => {
      const stats = circuitBookings.get(circuit.slug);
      if (stats && stats.count > 0) {
        circuitStatsArray.push({
          slug: circuit.slug,
          title: this.lang.language() === 'fr' ? circuit.title_fr : circuit.title_en,
          bookingsCount: stats.count,
          revenue: stats.revenue
        });
      }
    });

    circuitStatsArray.sort((a, b) => b.bookingsCount - a.bookingsCount);
    this.circuitStats.set(circuitStatsArray.slice(0, 5));

    this.isLoading.set(false);
  }

  getStatusPercentage(status: string): number {
    const total = this.stats().totalBookings;
    if (total === 0) return 0;

    switch (status) {
      case 'confirmed':
        return (this.stats().confirmedBookings / total) * 100;
      case 'pending':
        return (this.stats().pendingBookings / total) * 100;
      case 'cancelled':
        return (this.stats().cancelledBookings / total) * 100;
      default:
        return 0;
    }
  }

  truncateMessage(message: string): string {
    if (message.length > 50) {
      return message.substring(0, 50) + '...';
    }
    return message;
  }
}
