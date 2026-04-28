
-- Roles enum + table (secure pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- work_samples table
CREATE TABLE public.work_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  external_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work samples"
  ON public.work_samples FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert work samples"
  ON public.work_samples FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update work samples"
  ON public.work_samples FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete work samples"
  ON public.work_samples FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_work_samples_category ON public.work_samples (skill_category);

-- Storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-samples', 'work-samples', true);

CREATE POLICY "Public can view work sample files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'work-samples');

CREATE POLICY "Admins can upload work sample files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'work-samples' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update work sample files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'work-samples' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete work sample files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'work-samples' AND public.has_role(auth.uid(), 'admin'));
