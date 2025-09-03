// Strike-through functionality
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const text = checkbox.nextElementSibling;
      if (checkbox.checked) {
        text.classList.add('completed');
      } else {
        text.classList.remove('completed');
      }
    });
  });

  // Show alert if add input is empty
  const addForm = document.getElementById('addForm');
  const taskInput = document.getElementById('taskInput');

  if (addForm && taskInput) {
    addForm.addEventListener('submit', (e) => {
      if (!taskInput.value.trim()) {
        e.preventDefault();
        alert('Please enter a task before adding.');
        taskInput.focus();
      }
    });
  }

  const filterSelect = document.getElementById('filter');
  if (filterSelect && filterSelect.form) {
    filterSelect.addEventListener('change', () => filterSelect.form.submit());
  }
});

function toggleEdit(button) {
  const task = button.closest('.task');
  const editForm = task.querySelector('.edit-form');

  if (editForm.style.display === 'none' || editForm.style.display === '') {
    editForm.style.display = 'inline-block';
  } else {
    editForm.style.display = 'none';
  }
}