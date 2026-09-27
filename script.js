const nameInput = document.getElementById("studentName");
const dateInput = document.getElementById("attendanceDate");
const tableBody = document.querySelector("#attendanceTable tbody");

let students = [];
let rollNo = 1;

window.onload = function () {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
    if (students.length > 0) {
      rollNo = students[students.length - 1].roll + 1;
    }
  }
  dateInput.value = new Date().toISOString().split("T")[0];
  displayStudents();
  dateInput.addEventListener("change", displayStudents);
};

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Student name is required");
    return;
  }
  students.push({ roll: rollNo++, name, attendance: {} });
  nameInput.value = "";
  saveData();
  displayStudents();
}

function displayStudents() {
  tableBody.innerHTML = "";
  const selectedDate = dateInput.value;

  students.forEach((student) => {
    if (!student.attendance) student.attendance = {};
    const status = student.attendance[selectedDate] || "Not Marked";
    const statusClass =
      status === "Present"? "present" : status === "Absent"? "absent" : status === "Leave"? "leave" : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="student-check" value="${student.roll}"></td>
      <td>${student.roll}</td>
      <td>${student.name}</td>
      <td>
        <span class="${statusClass}">${status}</span>
        <div class="status-actions">
          <button class="status-btn present-btn" onclick="markAttendance(${student.roll}, 'Present')">Present</button>
          <button class="status-btn absent-btn" onclick="markAttendance(${student.roll}, 'Absent')">Absent</button>
          <button class="status-btn leave-btn" onclick="markAttendance(${student.roll}, 'Leave')">Leave</button>
          <button class="status-btn delete-btn" onclick="deleteStudent(${student.roll})">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function markAttendance(roll, status) {
  const student = students.find((s) => s.roll === roll);
  if (student) {
    student.attendance[dateInput.value] = status;
  }
  saveData();
  displayStudents();
  document.getElementById("selectAll").checked = false;
}

function deleteStudent(roll) {
  if (confirm("Do you want to delete this student?")) {
    students = students.filter((s) => s.roll!== roll);
    saveData();
    displayStudents();
    document.getElementById("selectAll").checked = false;
  }
}

function markSelected(status) {
  const selected = [...document.querySelectorAll(".student-check:checked")].map((cb) => +cb.value);
  if (!selected.length) return alert("Please select students first");
  students.forEach((s) => {
    if (selected.includes(s.roll)) {
      s.attendance[dateInput.value] = status;
    }
  });
  saveData();
  displayStudents();
  document.getElementById("selectAll").checked = false;
}

function toggleSelectAll() {
  const checked = document.getElementById("selectAll").checked;
  document.querySelectorAll(".student-check").forEach((cb) => (cb.checked = checked));
}