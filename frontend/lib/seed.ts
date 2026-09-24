import { apiFetch } from '@/lib/api';

export async function seedDefaultDataForUser(_userId: string) {
  const result = await apiFetch('/seed', { method: 'POST' });
  if (result.error) {
    throw new Error(result.error);
  }
}
