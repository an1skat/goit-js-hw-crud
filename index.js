const getStudentsBtn = document.getElementById("get-students-btn");
const addStudentForm = document.getElementById("add-student-form");
const studentsTableBody = document.querySelector("#students-table tbody");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal");
const editForm = document.getElementById("edit-student-form");

let students = [];

async function getStudents() {
  try {
    const res = await fetch("students.json");
    const studentsData = await res.json();

    students = studentsData.students;
    renderStudents(students);
  } catch (error) {
    console.error(error);
  }
}

function renderStudents(students) {
  studentsTableBody.innerHTML = "";
  students.forEach((student) => {
    const row = studentsTableBody.insertRow();
    row.insertCell().textContent = student.id;
    row.insertCell().textContent = student.name;
    row.insertCell().textContent = student.age;
    row.insertCell().textContent = student.course;
    row.insertCell().textContent = student.skills.join(", ");
    row.insertCell().textContent = student.email;
    row.insertCell().textContent = student.isEnrolled ? "Так" : "Ні";

    const actionsCell = row.insertCell();
    const updateButton = document.createElement("button");
    updateButton.textContent = "Оновити";
    updateButton.addEventListener("click", () => updateStudent(student.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", () => deleteStudent(student.id));

    actionsCell.appendChild(updateButton);
    actionsCell.appendChild(deleteButton);
  });
}

function addStudent(e) {
  e.preventDefault();

  const student = {
    id: students.at(-1).id + 1,
    name: e.target[0].value.trim(),
    age: parseInt(e.target[1].value),
    course: e.target[2].value.trim(),
    skills: e.target[3].value.split(","),
    email: e.target[4].value.trim(),
    isEnrolled: e.target[5].checked,
  };

  if (!validateStudent(student)) {
    alert("Будь ласка, заповніть усі поля коректно.");
    return;
  }

  students.push(student);
  renderStudents(students);
  addStudentForm.reset();
}

function updateStudent(id) {
  const student = students.find((student) => student.id === id);

  document.getElementById("edit-id").value = student.id;
  document.getElementById("edit-name").value = student.name;
  document.getElementById("edit-age").value = student.age;
  document.getElementById("edit-course").value = student.course;
  document.getElementById("edit-skills").value = student.skills.join(", ");
  document.getElementById("edit-email").value = student.email;
  document.getElementById("edit-enrolled").checked = student.isEnrolled;

  modal.classList.remove("hidden");
}

function deleteStudent(id) {
  students = students.filter((student) => student.id !== id);
  renderStudents(students);
}

function validateStudent(student) {
  if (
    !student.name ||
    isNaN(student.age) ||
    !student.course ||
    !Array.isArray(student.skills) ||
    student.skills.length === 0 ||
    !student.email.includes("@")
  ) {
    return false;
  }
  return true;
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById("edit-id").value);
  const student = students.find((s) => s.id === id);

  const updatedStudent = {
    id: id,
    name: document.getElementById("edit-name").value.trim(),
    age: parseInt(document.getElementById("edit-age").value),
    course: document.getElementById("edit-course").value.trim(),
    skills: document
      .getElementById("edit-skills")
      .value.split(",")
      .map((s) => s.trim()),
    email: document.getElementById("edit-email").value.trim(),
    isEnrolled: document.getElementById("edit-enrolled").checked,
  };

  if (!validateStudent(updatedStudent)) {
    alert("Будь ласка, перевірте правильність введених даних.");
    return;
  }

  Object.assign(student, updatedStudent);
  renderStudents(students);
  modal.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

getStudentsBtn.addEventListener("click", getStudents);
addStudentForm.addEventListener("submit", addStudent);
