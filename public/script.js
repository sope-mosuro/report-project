let taskCounts = { 1: 1, 2: 1, 3: 1 };

document.querySelectorAll('.addTaskButton').forEach(button => {
    button.addEventListener('click', function () {
        const reportNum = this.getAttribute('data-report');
        taskCounts[reportNum]++;

        const tasksContainer = document.getElementById(`tasksContainer${reportNum}`);
        const newTaskEntry = document.createElement('div');
        newTaskEntry.classList.add('task-entry');

        newTaskEntry.innerHTML = `
            <h3>Task #${taskCounts[reportNum]}</h3>
            
            <!-- Client Name -->
            <label for="clientName${reportNum}_${taskCounts[reportNum]}">Client Name:</label>
            <input type="text" id="clientName${reportNum}_${taskCounts[reportNum]}" name="clientName${reportNum}[]">

            <!-- Product -->
            <label for="product${reportNum}_${taskCounts[reportNum]}">Product:</label>
            <input type="text" id="product${reportNum}_${taskCounts[reportNum]}" name="product${reportNum}[]">

            <!-- Prior Week Activities (Done) -->
            <label for="completedTask${reportNum}_${taskCounts[reportNum]}">Prior Week Activities (Done):</label>
            <textarea id="completedTask${reportNum}_${taskCounts[reportNum]}" name="completedTask${reportNum}[]" rows="3"></textarea>

            <!-- Present Week Activities (To Be Done) -->
            <label for="currentTask${reportNum}_${taskCounts[reportNum]}">Present Week Activities (To Be Done):</label>
            <textarea id="currentTask${reportNum}_${taskCounts[reportNum]}" name="currentTask${reportNum}[]" rows="3" ></textarea>

            <!-- Outstanding -->
            <label for="outstandingTask${reportNum}_${taskCounts[reportNum]}">Outstanding:</label>
            <textarea id="outstandingTask${reportNum}_${taskCounts[reportNum]}" name="outstandingTask${reportNum}[]" rows="3" ></textarea>
        `;

        tasksContainer.appendChild(newTaskEntry);
    });
});
