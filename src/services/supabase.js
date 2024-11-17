import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://guboiuycpbvqysvimnnc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Ym9pdXljcGJ2cXlzdmltbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTc0MzIsImV4cCI6MjA0NzM3MzQzMn0.WVdJ6jHtlW3ldZ-BYiHTeHmSia8w72PHdQfAR1nN9nw";
export const supabase = createClient(supabaseUrl, supabaseKey);
