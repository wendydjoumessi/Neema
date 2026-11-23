CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  alert_by_sms BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_contacts TO authenticated;
GRANT ALL ON public.emergency_contacts TO service_role;

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emergency contacts"
ON public.emergency_contacts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own emergency contacts"
ON public.emergency_contacts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts"
ON public.emergency_contacts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts"
ON public.emergency_contacts FOR DELETE TO authenticated
USING (auth.uid() = user_id);