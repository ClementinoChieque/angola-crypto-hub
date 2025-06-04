
-- Drop the existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function that handles duplicate usernames and missing data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_username text;
  counter integer := 0;
  final_username text;
BEGIN
  -- Extract username from metadata, fallback to phone number or id
  user_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.phone,
    NEW.id::text
  );
  
  -- If still null, use a default pattern
  IF user_username IS NULL OR user_username = '' THEN
    user_username := 'user_' || NEW.id::text;
  END IF;
  
  final_username := user_username;
  
  -- Handle duplicate usernames by appending a number
  LOOP
    BEGIN
      INSERT INTO public.profiles (
        id, 
        username, 
        full_name, 
        avatar_url,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        final_username,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
      );
      
      -- If we get here, the insert was successful
      EXIT;
      
    EXCEPTION WHEN unique_violation THEN
      -- If username is not unique, try with a number suffix
      counter := counter + 1;
      final_username := user_username || '_' || counter::text;
      
      -- Prevent infinite loop
      IF counter > 1000 THEN
        final_username := 'user_' || NEW.id::text;
        EXIT;
      END IF;
    END;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
