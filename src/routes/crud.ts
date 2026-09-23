import { Router, Request, Response } from 'express';
import { authMiddleware, AuthedRequest } from '../middleware/auth';

const router = Router;

const ALLOWED_TABLES = new Set([
  'books',
  'study_sessions',
  'journal_entries',
  'schedule_entries',
  'settings',
  'weekly_goals',
  'instrument_practices',
  'weekly_reviews',
  'tasks',
  'fixed_activities',
  'study_subjects',
  'daily_progress',
]);

const crud = router();

crud.use(authMiddleware);

function getTable(req: AuthedRequest) {
  return req.params.table;
}

function validateTable(req: AuthedRequest, res: Response): boolean {
  const table = getTable(req);
  if (!ALLOWED_TABLES.has(table)) {
    res.status(403).json({ error: `Table '${table}' is not allowed` });
    return false;
  }
  return true;
}

crud.get('/:table', async (req: AuthedRequest, res) => {
  if (!validateTable(req, res)) return;
  const client = req.userClient!;
  const { select, order, limit, filter_field, filter_value, filter_in, single, maybe_single } = req.query;

  let query = client.from(req.params.table).select(typeof select === 'string' ? select : '*');

  if (filter_field && filter_value) {
    query = query.eq(String(filter_field), String(filter_value));
  }

  if (filter_in && filter_field) {
    const values = String(filter_in).split(',');
    query = query.in(String(filter_field), values);
  }

  if (order) {
    const [column, ascending] = String(order).split(':');
    query = query.order(column, { ascending: ascending !== 'false' });
  }

  if (limit) {
    query = query.limit(parseInt(String(limit), 10));
  }

  if (single === 'true') {
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ data });
    return;
  }

  if (maybe_single === 'true') {
    const { data, error } = await query.maybeSingle();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ data });
    return;
  }

  const { data, error } = await query;
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ data });
});

crud.post('/:table', async (req: AuthedRequest, res) => {
  if (!validateTable(req, res)) return;
  const client = req.userClient!;
  const body = Array.isArray(req.body) ? req.body : [req.body];

  const { data, error } = await client.from(req.params.table).insert(body).select();
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ data });
});

crud.put('/:table', async (req: AuthedRequest, res) => {
  if (!validateTable(req, res)) return;
  const client = req.userClient!;
  const { filter_field, filter_value } = req.query;

  if (!filter_field || !filter_value) {
    res.status(400).json({ error: 'filter_field and filter_value required for PUT' });
    return;
  }

  const { data, error } = await client
    .from(req.params.table)
    .update(req.body)
    .eq(String(filter_field), String(filter_value))
    .select();
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ data });
});

crud.delete('/:table', async (req: AuthedRequest, res) => {
  if (!validateTable(req, res)) return;
  const client = req.userClient!;
  const { filter_field, filter_value, filter_in } = req.query;

  if (!filter_field) {
    res.status(400).json({ error: 'filter_field required for DELETE' });
    return;
  }

  let query = client.from(req.params.table).delete();

  if (filter_in) {
    const values = String(filter_in).split(',');
    query = query.in(String(filter_field), values);
  } else if (filter_value) {
    query = query.eq(String(filter_field), String(filter_value));
  } else {
    res.status(400).json({ error: 'filter_value or filter_in required for DELETE' });
    return;
  }

  const { error } = await query;
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.json({ success: true });
});

export default crud;
