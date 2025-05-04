// Import Supabase client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://tqrumombrqzwbjmvlirf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcnVtb21icnF6d2JqbXZsaXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTE1MzIsImV4cCI6MjA2MTc4NzUzMn0.n2YqfbhCbpZDYNdSmrf0UwNqUvUZyNrLecLtOU8iTmI';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const termsCheckbox = document.getElementById('terms');
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const role = document.querySelector('input[name="role"]:checked').value;
        const termsAccepted = termsCheckbox.checked;
        
        if (!fullname || !email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!termsAccepted) {
            showMessage('Please accept the Terms and Privacy Policy', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = document.querySelector('.btn-create');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;
            
            // Sign up with Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                        role: role
                    },
                    emailRedirectTo: `${window.location.origin}/Html/login.html`
                }
            });
            
            if (error) throw error;
            
            // Success - show confirmation message
            showMessage('Registration successful! Please check your email for confirmation.', 'success');
            
            // Reset form
            signupForm.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Signup error:', error.message);
            showMessage(error.message || 'Failed to create account. Please try again.', 'error');
            
            // Reset button
            const submitBtn = document.querySelector('.btn-create');
            submitBtn.textContent = 'Create account';
            submitBtn.disabled = false;
        }
    });
    
    // Check if user is already logged in
    const checkAuthState = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            // User is already logged in, redirect to dashboard
            window.location.href = '../public/index.html';
        }
    };
    
    // Check auth state on page load
    checkAuthState();
});

// Helper function to show messages
function showMessage(message, type = 'info') {
    // Check if message container exists, if not create it
    let messageContainer = document.querySelector('.message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        document.querySelector('.signup-card').prepend(messageContainer);
        
        // Add styles to the message container
        messageContainer.style.width = '100%';
        messageContainer.style.padding = '10px';
        messageContainer.style.marginBottom = '20px';
        messageContainer.style.borderRadius = '5px';
        messageContainer.style.textAlign = 'center';
    }
    
    // Set message type styles
    if (type === 'error') {
        messageContainer.style.backgroundColor = '#ffebee';
        messageContainer.style.color = '#c62828';
        messageContainer.style.border = '1px solid #ef9a9a';
    } else if (type === 'success') {
        messageContainer.style.backgroundColor = '#e8f5e9';
        messageContainer.style.color = '#2e7d32';
        messageContainer.style.border = '1px solid #a5d6a7';
    } else {
        messageContainer.style.backgroundColor = '#e3f2fd';
        messageContainer.style.color = '#1565c0';
        messageContainer.style.border = '1px solid #90caf9';
    }
    
    // Set message text
    messageContainer.textContent = message;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
    
    // Show the message
    messageContainer.style.display = 'block';
}