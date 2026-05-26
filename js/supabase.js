const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function submitContactForm(formData) {
    const { data, error } = await supabaseClient
        .from('contacts')
        .insert([
            {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                subject: formData.subject,
                message: formData.message,
                created_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) throw error;
    return data;
}