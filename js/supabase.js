const SUPABASE_URL = 'https://pwcvdhuuyaspwlxljsib.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3Y3ZkaHV1eWFzcHdseGxqc2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODM1MzgsImV4cCI6MjA5MzQ1OTUzOH0.juEuRm5tcvSUba9sS-DTCM6TbeO_Oex5fbe3EC8peDE';

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