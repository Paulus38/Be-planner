import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;
  private readonly serviceRoleKey: string;
  readonly client: SupabaseClient;
  readonly serviceClient: SupabaseClient;
  readonly hasServiceRoleKey: boolean;

  constructor() {
    if (typeof globalThis.WebSocket === 'undefined') {
      (globalThis as typeof globalThis & { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
    }

    this.url = process.env.SUPABASE_URL as string;
    this.anonKey = process.env.SUPABASE_ANON_KEY as string;
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    this.hasServiceRoleKey = Boolean(this.serviceRoleKey);

    if (!this.url || !this.anonKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }

    this.client = createClient(this.url, this.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (this.serviceRoleKey) {
      this.serviceClient = createClient(this.url, this.serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    } else {
      this.serviceClient = this.client;
    }
  }

  getUserClient(userId: string): SupabaseClient {
    return createClient(this.url, this.serviceRoleKey || this.anonKey, {
      global: {
        headers: {
          'x-user-id': userId,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
