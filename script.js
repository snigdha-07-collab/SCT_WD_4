const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressCircle = document.getElementById("progressCircle");
const progressPercent = document.getElementById("progressPercent");

const liveClock = document.getElementById("liveClock");
const liveDate = document.getElementById("liveDate");

const themeToggle = document.getElementById("themeToggle");
const popup = document.getElementById("popup");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const quotes = [

"Small progress is still progress.",

"Discipline beats motivation.",

"Dream big. Start small.",

"Focus on what matters.",

"Done is better than perfect.",

"One task at a time.",

"Your future depends on today."

];

document.getElementById("quoteText").textContent =
quotes[Math.floor(Math.random()*quotes.length)];

function updateClock(){

const now = new Date();

liveClock.textContent =
now.toLocaleTimeString();

liveDate.textContent =
now.toDateString();

}

setInterval(updateClock,1000);

updateClock();

themeToggle.onclick = ()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){

themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';

}else{

themeToggle.innerHTML='<i class="fa-solid fa-moon"></i>';

}

};


// ===============================
// Save Tasks
// ===============================

function saveTasks(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

}


// ===============================
// Popup
// ===============================

function showPopup(message){

popup.querySelector("span").textContent=message;

popup.classList.add("show");

setTimeout(()=>{

popup.classList.remove("show");

},2000);

}
// ===============================
// Add Task
// ===============================

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

function addTask(){

    const text = taskInput.value.trim();

    if(text === ""){
        alert("Please enter a task.");
        return;
    }

    const task = {

        id: Date.now(),

        title: text,

        date: taskDate.value,

        time: taskTime.value,

        priority: taskPriority.value,

        completed: false

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateStats();

    taskInput.value="";
    taskDate.value="";
    taskTime.value="";
    taskPriority.value="High";

    showPopup("Task Added Successfully!");
}


// ===============================
// Render Tasks
// ===============================

function renderTasks(){

    taskList.innerHTML="";

    let keyword = searchTask.value.toLowerCase();

    tasks.forEach(task=>{

        if(!task.title.toLowerCase().includes(keyword))
            return;

        const li=document.createElement("li");

        li.className="task";

        if(task.completed)
            li.classList.add("completed");

        li.innerHTML=`

<div class="task-left">

<input type="checkbox"
${task.completed ? "checked" : ""}
onclick="toggleTask(${task.id})">

<div class="task-content">

<h3>${task.title}</h3>

<p>

📅 ${task.date || "No Date"}

&nbsp;&nbsp;

🕒 ${task.time || "--"}

</p>

<span class="priority ${task.priority.toLowerCase()}">

${task.priority}

</span>

</div>

</div>

<div class="task-actions">

<button
class="edit-btn"
onclick="editTask(${task.id})">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
onclick="deleteTask(${task.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

        taskList.appendChild(li);

    });

}


// ===============================
// Delete Task
// ===============================

function deleteTask(id){

    tasks = tasks.filter(task=>task.id!==id);

    saveTasks();

    renderTasks();

    updateStats();

}


// ===============================
// Toggle Complete
// ===============================

function toggleTask(id){

    tasks = tasks.map(task=>{

        if(task.id===id){

            task.completed=!task.completed;

            if(task.completed){

                showPopup("Task Completed 🎉");

            }

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateStats();

}


// ===============================
// Edit Task
// ===============================

function editTask(id){

    const task=tasks.find(t=>t.id===id);

    const newTitle=prompt("Edit Task",task.title);

    if(newTitle===null) return;

    task.title=newTitle.trim();

    saveTasks();

    renderTasks();

}
// ===============================
// SEARCH
// ===============================

searchTask.addEventListener("keyup", renderTasks);

// ===============================
// FILTERS
// ===============================

let currentFilter = "all";

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// ===============================
// UPDATE RENDER WITH FILTER
// ===============================

const originalRender = renderTasks;

renderTasks = function () {

    taskList.innerHTML = "";

    const keyword = searchTask.value.toLowerCase();

    tasks.forEach(task => {

        if (!task.title.toLowerCase().includes(keyword))
            return;

        if (currentFilter === "completed" && !task.completed)
            return;

        if (currentFilter === "pending" && task.completed)
            return;

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed)
            li.classList.add("completed");

        li.innerHTML = `
        <div class="task-left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onclick="toggleTask(${task.id})">

            <div class="task-content">

                <h3>${task.title}</h3>

                <p>
                    📅 ${task.date || "No Date"}
                    &nbsp;&nbsp;
                    🕒 ${task.time || "--"}
                </p>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

        </div>

        <div class="task-actions">

            <button
            class="edit-btn"
            onclick="editTask(${task.id})">

            <i class="fa-solid fa-pen"></i>

            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${task.id})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </div>
        `;

        taskList.appendChild(li);

    });

};

// ===============================
// STATISTICS
// ===============================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressPercent.textContent = percent + "%";

    const circumference = 408;

    progressCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;

}

// ===============================
// THEME SAVE
// ===============================

if(localStorage.getItem("theme")==="light"){

    document.body.classList.add("light");

    themeToggle.innerHTML =
    '<i class="fa-solid fa-sun"></i>';

}

themeToggle.addEventListener("click",()=>{

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

    }else{

        localStorage.setItem("theme","dark");

    }

});

// ===============================
// SHORTCUTS
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" &&
       document.activeElement===taskInput){

        addTask();

    }

});

// ===============================
// INITIALIZE
// ===============================

renderTasks();

updateStats();