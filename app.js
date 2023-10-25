let studentName = document.querySelector("#name");
let lectureName = document.querySelector("#class");
let warningMessage = document.querySelectorAll(".warning-msg");
let submitButton = document.querySelector("#submit-btn");
let attendanceContainer = document.querySelector(".attendance-list-container");
let loader = document.querySelector("#loader");
let callToAction = document.querySelector(".call-to-action");
let search = document.querySelector("#search-box");
let filter = document.querySelector("#filter-dropdown");
let searchBox;
let eraseRestoreBtn = [];
let attendanceList = [];
let filterIndex = [];
let childIndex = 0;
const namePattern = /^[A-Za-z]+ ?([A-Za-z]+ ?[A-Za-z]+)?$/;
const classPattern = /^[A-Za-z]+ ?(\d{3}) ?(-? ?[A-Za-z]+)?$/;
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Checking if the number of children in the attendanceContainer has increased.
// const config = { attributes: true, childList: true, subtree: true };
const ifChanged = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      // When it increases the eraseRestore function is called to add an eventlistener to the new child element for erasing and restoring attendances
      eraseRestore(childIndex);
      childIndex++;
    }
  }
};

const observer = new MutationObserver(ifChanged);
observer.observe(attendanceContainer, { childList: true });

// When the web page window is loaded previously saved attendances if available are fetched from the localstorage to be displayed
window.addEventListener("load", function (e) {
  if (localStorage.getItem("attendances")) {
    JSON.parse(localStorage.getItem("attendances")).forEach((attendance) => {
      const newAttendance = document.createElement("div");
      newAttendance.classList.add("attendance-list");
      newAttendance.innerHTML = `<div class="attendance">
              <h3>${attendance.name}</h3>
              <p>${attendance.class}</p>
              <p class="date-time">${attendance.entryTime}</p>
            </div>
            <div class="remove-restore">
              <span class="material-symbols-outlined icon">
                ${
                  !attendance.erase
                    ? "format_ink_highlighter"
                    : "settings_backup_restore"
                }
                <span class="tooltiptext">
                ${!attendance.erase ? "Erase name" : "Restore name"}
                </span>
              </span>
            </div>`;
      if (attendance.erase) {
        newAttendance.classList.add("erase");
      }
      attendanceContainer.appendChild(newAttendance);
      attendanceList.push(attendance);
    });
  }

  setTimeout(function () {
    loader.style.display = "none";
  }, 1500);
});

// The submit attendance button to add the filled name and class to the attendance with the time it was added
studentName.addEventListener("input", () => {
  if (namePattern.test(studentName.value.trim())) {
    submitButton.removeAttribute("disabled");
    warningMessage[0].classList.remove("active");
  } else {
    submitButton.setAttribute("disabled", "disabled");
    warningMessage[0].classList.add("active");
  }
});

lectureName.addEventListener("input", () => {
  if (classPattern.test(lectureName.value.trim())) {
    submitButton.removeAttribute("disabled");
    warningMessage[1].classList.remove("active");
  } else {
    submitButton.setAttribute("disabled", "disabled");
    warningMessage[1].classList.add("active");
  }
});
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (studentName.value.length < 5) {
    e.target.setAttribute("disabled", "disabled");
    warningMessage[0].classList.add("active");
  } else if (lectureName.value === "") {
    e.target.setAttribute("disabled", "disabled");
    warningMessage[1].classList.add("active");
  } else {
    const now = new Date();
    let year = now.getFullYear();
    let month = months[now.getMonth()];
    let date = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let am_pm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let currentDateTIme = `${hour}:${minutes} ${am_pm}  ${month} ${date}, ${year}`;
    attendanceList.push({
      name: studentName.value.trim(),
      class: lectureName.value.trim(),
      erase: false,
      entryTime: currentDateTIme,
    });
    const newAttendance = document.createElement("div");
    newAttendance.classList.add("attendance-list");
    newAttendance.innerHTML = `<div class="attendance">
              <h3>${attendanceList[attendanceList.length - 1].name}</h3>
              <p>${attendanceList[attendanceList.length - 1].class}</p>
              <p class="date-time">${
                attendanceList[attendanceList.length - 1].entryTime
              }</p>
            </div>
            <div class="remove-restore">
              <span class="material-symbols-outlined icon">
                format_ink_highlighter
                <span class="tooltiptext">Erase name</span>
              </span>
            </div>`;
    attendanceContainer.appendChild(newAttendance);
    studentName.value = "";
    lectureName.value = "";
    localStorage.setItem("attendances", JSON.stringify(attendanceList));
  }
});

// Search functionality
search.addEventListener("input", () => {
  searchBox = search.value.trim().toLowerCase();
  if (searchBox === "") {
    for (let x = 0; x < attendanceContainer.children.length; x++) {
      // console.log(attendanceList[x].erase);
      if (attendanceList[x].erase) {
        attendanceContainer.children[x].classList = "attendance-list erase";
      } else {
        attendanceContainer.children[x].classList = "attendance-list";
      }
    }
  } else {
    const regex = new RegExp(searchBox, "gi");

    let searchInput;
    // let indexArr = [];
    // console.log(searchBox);
    attendanceList.forEach((attendance, i) => {
      searchInput = attendance.name;
      const matches = searchInput.match(regex);
      if (matches) {
        if (attendanceList[i].erase) {
          attendanceContainer.children[i].classList = "attendance-list erase";
        } else {
          attendanceContainer.children[i].classList = "attendance-list";
        }
      } else {
        // indexArr.push(index);
        if (attendanceList[i].erase) {
          attendanceContainer.children[i].classList =
            "attendance-list erase not-displayed";
        } else {
          attendanceContainer.children[i].classList =
            "attendance-list not-displayed";
        }
      }
    });
  }
});

// Filtering attendances (all, crossed, not crossed)
filter.addEventListener("change", () => {
  for (let i = 0; i < attendanceContainer.children.length; i++) {
    filterIndex.forEach((index) => {
      if (filterIndex[0] != undefined && i === index) {
        attendanceContainer.children[index].classList.remove("not-displayed");
      }
    });
    if (filter.value === "crossed") {
      if (
        attendanceContainer.children[i].classList != "attendance-list erase" &&
        !attendanceContainer.children[i].classList.contains("not-displayed")
      ) {
        attendanceContainer.children[i].classList.add("not-displayed");
        filterIndex.push(i);
      }
    } else if (filter.value === "uncrossed") {
      if (
        attendanceContainer.children[i].classList != "attendance-list" &&
        !attendanceContainer.children[i].classList.contains("not-displayed")
      ) {
        attendanceContainer.children[i].classList.add("not-displayed");
        filterIndex.push(i);
      } else {
        filterIndex.forEach((index) => {
          if (filterIndex[0] != undefined && i === index) {
            attendanceContainer.children[index].classList.remove(
              "not-displayed"
            );
          }
        });
      }
    }
  }
});

// Erasing and Restoring attendance
function eraseRestore(i) {
  eraseRestoreBtn = document.getElementsByClassName("icon");

  // Add event listeners
  for (let index = 0; index < eraseRestoreBtn.length; index++) {
    if (i === index) {
      eraseRestoreBtn[index].addEventListener("click", (e) => {
        e.stopPropagation();
        eraseRestoreClickHandler(e, index);
      });
    }
  }
}

function eraseRestoreClickHandler(e, index) {
  // console.log(e.target);
  e.target.parentNode.parentNode.classList.toggle("erase");
  if (!e.target.textContent.includes("format_ink_highlighter")) {
    e.target.innerHTML = `
          format_ink_highlighter 
          <span class="tooltiptext">Erase name</span>`;
    attendanceList[index].erase = false;
    e.target.classList.remove("restore-btn");
  } else {
    e.target.innerHTML = `settings_backup_restore 
        <span class="tooltiptext">Restore name</span>`;
    e.target.classList.add("restore-btn");
    attendanceList[index].erase = true;
  }
  localStorage.setItem("attendances", JSON.stringify(attendanceList));
}
// : callToAction.classList.add("disabled")
// }
