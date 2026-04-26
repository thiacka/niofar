import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';

type PageState = 'loading' | 'form' | 'success' | 'error';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="set-password-page">
      <div class="card">

        <!-- Logo -->
        <div class="brand">
          <span class="brand-name">NIO FAR</span>
          <span class="brand-sub">Tourisme — Backoffice</span>
        </div>

        <!-- Chargement -->
        @if (state() === 'loading') {
          <div class="state-block">
            <div class="spinner"></div>
            <p>Vérification du lien en cours…</p>
          </div>
        }

        <!-- Formulaire -->
        @if (state() === 'form') {
          <div class="form-block">
            <h1>Définir mon mot de passe</h1>
            <p class="intro">Bienvenue <strong>{{ userName() }}</strong> ! Choisissez un mot de passe sécurisé pour accéder au backoffice.</p>

            @if (errorMsg()) {
              <div class="alert error">{{ errorMsg() }}</div>
            }

            <form (ngSubmit)="submit()">
              <div class="form-group">
                <label for="pw">Nouveau mot de passe</label>
                <div class="input-wrap">
                  <input
                    [type]="showPw() ? 'text' : 'password'"
                    id="pw"
                    [(ngModel)]="password"
                    name="password"
                    autocomplete="new-password"
                    placeholder="Minimum 8 caractères"
                    required
                  />
                  <button type="button" class="toggle-pw" (click)="toggleShowPw()" [attr.aria-label]="showPw() ? 'Masquer' : 'Afficher'">
                    @if (showPw()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                </div>
                <!-- Jauge de force -->
                <div class="strength-bar">
                  <div class="strength-fill" [style.width]="strengthPercent() + '%'" [class]="'strength-' + strengthLevel()"></div>
                </div>
                <span class="strength-label" [class]="'strength-' + strengthLevel()">{{ strengthLabel() }}</span>
              </div>

              <div class="form-group">
                <label for="confirm">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirm"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  autocomplete="new-password"
                  placeholder="Répétez votre mot de passe"
                  required
                />
                @if (confirmPassword && password !== confirmPassword) {
                  <span class="field-error">Les mots de passe ne correspondent pas.</span>
                }
              </div>

              <button type="submit" class="btn-submit" [disabled]="isSaving() || !isValid()">
                @if (isSaving()) {
                  <span class="spinner-sm"></span> Enregistrement…
                } @else {
                  🔑 Enregistrer mon mot de passe
                }
              </button>
            </form>
          </div>
        }

        <!-- Succès -->
        @if (state() === 'success') {
          <div class="state-block success">
            <div class="success-icon">✅</div>
            <h2>Mot de passe enregistré !</h2>
            <p>Votre compte est maintenant configuré. Vous pouvez vous connecter au backoffice avec votre email <strong>{{ userEmail() }}</strong>.</p>
            <a routerLink="/admin" class="btn-submit" style="display:block;text-align:center;text-decoration:none;">
              Se connecter au backoffice →
            </a>
          </div>
        }

        <!-- Erreur -->
        @if (state() === 'error') {
          <div class="state-block error-state">
            <div class="error-icon">⚠️</div>
            <h2>Lien invalide ou expiré</h2>
            <p>{{ errorMsg() }}</p>
            <p style="font-size:.9rem;color:#7A6355;">
              Contactez votre administrateur pour obtenir un nouveau lien d'invitation.
            </p>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .set-password-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #3D2B1F 0%, #C4682B 60%, #F5D98B 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 40px 36px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }

    .brand {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-name {
      display: block;
      font-family: Georgia, serif;
      font-size: 2rem;
      font-weight: 700;
      color: #3D2B1F;
      letter-spacing: 4px;
    }

    .brand-sub {
      display: block;
      font-size: .75rem;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: #C4682B;
      margin-top: 2px;
    }

    h1 {
      font-family: Georgia, serif;
      font-size: 1.4rem;
      color: #3D2B1F;
      margin: 0 0 8px;
    }

    .intro {
      font-size: .9rem;
      color: #7A6355;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      font-size: .85rem;
      font-weight: 600;
      color: #3D2B1F;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #D5C5B5;
      border-radius: 8px;
      font-size: .95rem;
      color: #1A1410;
      outline: none;
      box-sizing: border-box;
      transition: border-color .2s;
    }

    input:focus { border-color: #C4682B; }

    .input-wrap {
      position: relative;
    }

    .input-wrap input {
      padding-right: 42px;
    }

    .toggle-pw {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #7A6355;
      display: flex;
      align-items: center;
      padding: 0;
    }

    .toggle-pw:hover { color: #C4682B; }

    /* Jauge de force */
    .strength-bar {
      height: 4px;
      background: #EDE3D8;
      border-radius: 2px;
      margin-top: 8px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width .3s, background .3s;
    }

    .strength-fill.strength-weak   { background: #dc2626; }
    .strength-fill.strength-medium { background: #f59e0b; }
    .strength-fill.strength-strong { background: #16a34a; }

    .strength-label {
      font-size: .75rem;
      font-weight: 600;
      margin-top: 4px;
      display: inline-block;
    }
    .strength-label.strength-weak   { color: #dc2626; }
    .strength-label.strength-medium { color: #f59e0b; }
    .strength-label.strength-strong { color: #16a34a; }

    .field-error {
      display: block;
      font-size: .78rem;
      color: #dc2626;
      margin-top: 4px;
    }

    .btn-submit {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #C4682B, #A0501F);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: .95rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity .2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-submit:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .btn-submit:not(:disabled):hover { opacity: .88; }

    .alert {
      border-radius: 8px;
      padding: 10px 14px;
      font-size: .85rem;
      margin-bottom: 16px;
    }

    .alert.error { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }

    /* States */
    .state-block {
      text-align: center;
      padding: 16px 0;
    }

    .success-icon, .error-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      display: block;
    }

    .state-block h2 {
      font-family: Georgia, serif;
      color: #3D2B1F;
      margin-bottom: 12px;
    }

    .state-block p {
      color: #7A6355;
      font-size: .9rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(196,104,43,.15);
      border-top-color: #C4682B;
      border-radius: 50%;
      animation: spin .8s linear infinite;
      margin: 0 auto 16px;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .7s linear infinite;
      display: inline-block;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SetPasswordComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private router   = inject(Router);
  private supabase = inject(SupabaseService);

  state         = signal<PageState>('loading');
  errorMsg      = signal('');
  userName      = signal('');
  userEmail     = signal('');
  isSaving      = signal(false);
  showPw        = signal(false);

  password        = '';
  confirmPassword = '';
  private token   = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.errorMsg.set('Aucun token fourni dans le lien.');
      this.state.set('error');
      return;
    }
    this.token = token;
    this.validateToken(token);
  }

  private async validateToken(token: string): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('password_reset_tokens')
        .select('user_id, expires_at, used_at, users(name, email)')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        this.errorMsg.set('Ce lien est invalide. Vérifiez l\'URL ou contactez votre administrateur.');
        this.state.set('error');
        return;
      }

      if (data.used_at) {
        this.errorMsg.set('Ce lien a déjà été utilisé. Demandez un nouveau lien d\'invitation à votre administrateur.');
        this.state.set('error');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        this.errorMsg.set('Ce lien a expiré (valable 48 heures). Demandez un nouveau lien à votre administrateur.');
        this.state.set('error');
        return;
      }

      const user = (data as any).users;
      this.userName.set(user?.name ?? '');
      this.state.set('form');
    } catch (err) {
      this.errorMsg.set('Une erreur est survenue lors de la vérification du lien.');
      this.state.set('error');
    }
  }

  async submit(): Promise<void> {
    if (!this.isValid()) return;

    this.isSaving.set(true);
    this.errorMsg.set('');

    try {
      const { data, error } = await this.supabase.client.functions.invoke('reset-password', {
        body: { token: this.token, newPassword: this.password },
      });

      if (error) throw error;

      if (data?.error) {
        const msgs: Record<string, string> = {
          invalid_token: 'Ce lien est invalide.',
          expired_token: 'Ce lien a expiré.',
          already_used:  'Ce lien a déjà été utilisé.',
          weak_password: 'Le mot de passe doit contenir au moins 8 caractères.',
        };
        this.errorMsg.set(msgs[data.error] ?? 'Une erreur est survenue.');
        return;
      }

      this.userEmail.set(data?.email ?? '');
      this.state.set('success');
    } catch (err) {
      this.errorMsg.set('Une erreur réseau est survenue. Veuillez réessayer.');
      console.error('reset-password error:', err);
    } finally {
      this.isSaving.set(false);
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  toggleShowPw(): void { this.showPw.set(!this.showPw()); }

  isValid(): boolean {
    return (
      this.password.length >= 8 &&
      this.password === this.confirmPassword
    );
  }

  strengthPercent(): number {
    const p = this.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score += 30;
    if (p.length >= 12) score += 20;
    if (/[A-Z]/.test(p))          score += 15;
    if (/[0-9]/.test(p))          score += 15;
    if (/[^A-Za-z0-9]/.test(p))   score += 20;
    return Math.min(score, 100);
  }

  strengthLevel(): 'weak' | 'medium' | 'strong' {
    const s = this.strengthPercent();
    if (s < 40) return 'weak';
    if (s < 75) return 'medium';
    return 'strong';
  }

  strengthLabel(): string {
    const labels = { weak: 'Faible', medium: 'Moyen', strong: 'Fort' };
    return this.password ? labels[this.strengthLevel()] : '';
  }
}
