import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;
  readonly client: SupabaseClient;

  constructor() {
    if (typeof globalThis.WebSocket === 'undefined') {
      (globalThis as typeof globalThis & { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
    }

    this.url = process.env.SUPABASE_URL as string;
    this.anonKey = process.env.SUPABASE_ANON_KEY as string;

    if (!this.url || !this.anonKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }

    this.client = createClient(this.url, this.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  createUserClient(accessToken: string): SupabaseClient {
    return createClient(this.url, this.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
