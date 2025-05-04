document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const scoreForm = document.getElementById('scoreForm');
    const studentIdInput = document.getElementById('studentId');
    const nameInput = document.getElementById('name');
    const subjectInput = document.getElementById('subject');
    const scoreInput = document.getElementById('score');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const scoresBody = document.getElementById('scoresBody');
    
    // Load scores on page load
    loadScores();
    
    // Event Listeners
    scoreForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    
    // Functions
    async function loadScores() {
        try {
            const response = await fetch('/api/scores');
            const data = await response.json();
            
            renderScores(data);
        } catch (error) {
            console.error('Error loading scores:', error);
            alert('Failed to load scores. Please try again.');
        }
    }
    
    function renderScores(scores) {
        scoresBody.innerHTML = '';
        
        scores.forEach(score => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${score.id}</td>
                <td>${score.name}</td>
                <td>${score.subject}</td>
                <td>${score.score}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${score.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${score.id}">Delete</button>
                </td>
            `;
            
            scoresBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const studentData = {
            name: nameInput.value,
            subject: subjectInput.value,
            score: parseInt(scoreInput.value)
        };
        
        try {
            let response;
            
            if (studentIdInput.value) {
                // Update existing student
                response = await fetch(`/api/scores/${studentIdInput.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });
            } else {
                // Add new student
                response = await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });
            }
            
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            
            resetForm();
            loadScores();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    }
    
    async function handleEdit(e) {
        const id = e.target.dataset.id;
        
        try {
            const response = await fetch(`/api/scores`);
            const scores = await response.json();
            
            const score = scores.find(s => s.id == id);
            
            if (score) {
                // Populate form with student data
                studentIdInput.value = score.id;
                nameInput.value = score.name;
                subjectInput.value = score.subject;
                scoreInput.value = score.score;
                
                // Change button text and show cancel button
                submitBtn.textContent = 'Update Score';
                cancelBtn.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            alert('Failed to load student data for editing.');
        }
    }
    
    async function handleDelete(e) {
        if (!confirm('Are you sure you want to delete this score?')) {
            return;
        }
        
        const id = e.target.dataset.id;
        
        try {
            const response = await fetch(`/api/scores/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete score');
            }
            
            loadScores();
        } catch (error) {
            console.error('Error deleting score:', error);
            alert('Failed to delete score. Please try again.');
        }
    }
    
    function resetForm() {
        studentIdInput.value = '';
        nameInput.value = '';
        subjectInput.value = '';
        scoreInput.value = '';
        
        submitBtn.textContent = 'Add Score';
        cancelBtn.style.display = 'none';
    }
});