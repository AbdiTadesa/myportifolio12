-- Add file_type column to support image/video/pdf
ALTER TABLE public.work_samples
ADD COLUMN IF NOT EXISTS file_type TEXT NOT NULL DEFAULT 'image';

-- Auto-grant admin to the owner email when they sign up
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'abditadese112@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.grant_owner_admin();

-- If the owner already has an account, grant admin now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'abditadese112@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;