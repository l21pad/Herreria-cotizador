import { supabase } from '@/lib/supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase test catch error:', err);
    return false;
  }
}

export async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@herreria.com',
      password: 'test123456',
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (error) {
      console.error('Error creating test user:', error);
      return { success: false, error };
    }

    console.log('Test user created:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Test user creation catch error:', err);
    return { success: false, error: err };
  }
}
