-- Add a free-form summary for what was accomplished during the day.
ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS daily_summary text;
