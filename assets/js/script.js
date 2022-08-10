var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");

var tasks = [
    {
        id: 1,
        name: "Add localStorage persistence",
        type: "Web",
        status: "in progress"
    },
    {
        id: 2,
        name: "Learn JavaScript",
        type: "Web",
        status: "in progress"
    },
    {
        id: 3,
        name: "Refactor code",
        type: "Web",
        status: "to do"
    },
];

var tasks = [];

var taskFormHandler = function (event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!")
        return false;
    }

    formEl.reset();
  // package up data as an object
  var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task Id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
    };

// send it as an argument to createTaskEl
createTaskEl(taskDataObj);
    }
};
 
var createTaskEl = function(taskDataObj) {

    var createTaskActions = function(taskId) {
        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";

        //create edit button
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", taskId);

        actionContainerEl.appendChild(editButtonEl);

        //create delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", taskId);

        actionContainerEl.appendChild(deleteButtonEl);

        // 
        var statusSelectEl = document.createElement("select");
        statusSelectEl.className = "select-status";
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", taskId);

        var statusChoices = ["To Do", "In Progress", "Completed"];

        for (var i = 0; i < statusChoices.length; i++) {
            // CREATE OPTION ELEMENT
            var statusOptionEl = document.createElement("option");
            statusOptionEl.textContent = statusChoices[i];
            statusOptionEl.setAttribute("value", statusChoices[i]);

            statusSelectEl.appendChild(statusOptionEl)
        }

        actionContainerEl.appendChild(statusSelectEl);

        return actionContainerEl
    };


    // create  list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter);

    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();
    // Increase task counter for next uni que id
    taskIdCounter++;

};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }else if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array tio hold updated lists of tasks
    var updateTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
         if(tasks[i].id !== parseInt(tasksId)) {
            updatedTaskArr.push(tasks[i]);
         }
    }

    tasks = updateTaskArr
    saveTasks();
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);


    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +"']");

    
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formEl.setAttribute("data-task-id", taskId);

    document.querySelector("#save-task").textContent = "Save Task";
};

var completeEditTask = function (taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new code
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    saveTasks ();


    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected options value and cover to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
    }
    
    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if(!savedTasks) {
        return false;
    }
    for (var i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
}

loadTasks()

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
