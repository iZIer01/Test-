// Import Supabase client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://tqrumombrqzwbjmvlirf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcnVtb21icnF6d2JqbXZsaXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTE1MzIsImV4cCI6MjA2MTc4NzUzMn0.n2YqfbhCbpZDYNdSmrf0UwNqUvUZyNrLecLtOU8iTmI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if user is authenticated
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // User is not logged in, redirect to login page
        window.location.href = '../Html/login.html';
    } else {
        // User is logged in, you can display user info if needed
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Logged in as:', user.email);
        
        // You can add user info to the page if needed
        const container = document.querySelector('.container');
        if (container) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <p>Logged in as: ${user.email}</p>
                <button id="logout-btn">Logout</button>
            `;
            userInfo.style.textAlign = 'right';
            userInfo.style.marginBottom = '20px';
            container.prepend(userInfo);
            
            // Add logout functionality
            document.getElementById('logout-btn').addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.href = '../Html/login.html';
            });
        }
    }
}

// Run auth check when the page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Export the supabase client for use in other scripts
export { supabase };