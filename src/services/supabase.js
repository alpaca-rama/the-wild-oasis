import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://tggfizhfityveerhdtmu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ2ZpemhmaXR5dmVlcmhkdG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5ODExMTcsImV4cCI6MjAxNTU1NzExN30.ImhFZivq-o2Jb2vzf84pY7Dyeyzr88pnBu53cFJL3-Y'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase