/*
  # Create Promotion Usage Increment Function

  1. New Function
    - `increment_promotion_usage(promotion_id UUID)` - Increments the times_used counter for a promotion
    - Validates promotion exists and is active
    - Updates the times_used field atomically
    - Returns success boolean

  2. Security
    - Function is SECURITY DEFINER to allow anon users to increment usage
    - Only increments, no other operations allowed
    - Validates promotion is active before incrementing

  3. Notes
    - Called when a booking is created with a promotion code
    - Atomic increment prevents race conditions
    - Only increments if promotion is active
*/

CREATE OR REPLACE FUNCTION increment_promotion_usage(promotion_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the times_used counter for active promotions only
  UPDATE promotions
  SET times_used = times_used + 1
  WHERE id = promotion_id
    AND is_active = true
    AND (max_uses IS NULL OR times_used < max_uses)
    AND (valid_until IS NULL OR valid_until >= CURRENT_DATE);
  
  -- Return true if a row was updated, false otherwise
  RETURN FOUND;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION increment_promotion_usage IS 'Atomically increments the usage counter for an active promotion. Returns true if successful, false if promotion not found or inactive.';
