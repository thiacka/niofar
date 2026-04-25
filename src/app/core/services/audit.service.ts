import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuditAction } from '../models/user.model';

interface AuditOptions {
  entityId?: string;
  entityLabel?: string;
  details?: Record<string, unknown>;
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const SESSION_KEY = 'nio-far-admin-user';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private supabase = inject(SupabaseService);

  /**
   * Enregistre une action critique dans audit_logs.
   * Lit l'utilisateur courant depuis le sessionStorage pour éviter
   * toute dépendance circulaire avec AdminService.
   */
  async log(
    action: AuditAction,
    entityType: string,
    options?: AuditOptions
  ): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) return;

    try {
      await this.supabase.client.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        user_role: user.role,
        action,
        entity_type: entityType,
        entity_id: options?.entityId ?? null,
        entity_label: options?.entityLabel ?? null,
        details: options?.details ?? null
      });
    } catch (err) {
      // L'audit ne doit jamais faire planter l'opération principale
      console.warn('Audit log failed (non-blocking):', err);
    }
  }

  /** Raccourcis sémantiques */
  login(userName: string): Promise<void> {
    return this.log('LOGIN', 'session', { entityLabel: userName });
  }

  logout(userName: string): Promise<void> {
    return this.log('LOGOUT', 'session', { entityLabel: userName });
  }

  create(entityType: string, entityId: string, entityLabel: string, details?: Record<string, unknown>): Promise<void> {
    return this.log('CREATE', entityType, { entityId, entityLabel, details });
  }

  update(entityType: string, entityId: string, entityLabel: string, details?: Record<string, unknown>): Promise<void> {
    return this.log('UPDATE', entityType, { entityId, entityLabel, details });
  }

  delete(entityType: string, entityId: string, entityLabel: string): Promise<void> {
    return this.log('DELETE', entityType, { entityId, entityLabel });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  private getCurrentUser(): StoredUser | null {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored) as StoredUser; } catch { return null; }
  }
}
