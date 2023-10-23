let studentName = document.querySelector("#name");
let lectureName = document.querySelector("#class");
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
let length = 0;

// fetching existing attendances from localstorage
window.addEventListener("load", function (e) {
  // e.stopPropagation();
  // e.stopImmediatePropagation();
  if (localStorage.getItem("attendances")) {
    JSON.parse(localStorage.getItem("attendances")).forEach((attendance) => {
      const newAttendance = document.createElement("div");
      newAttendance.classList.add("attendance-list");
      newAttendance.innerHTML = `<div class="attendance">
              <h3>${attendance.name}</h3>
              <p>${attendance.class}</p>
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
    // eraseRestoreBtn = document.querySelectorAll(".remove-restore span");
    length = attendanceList.length;
  }
  // console.log(attendanceList[0]);
  eraseRestoreBtn = document.getElementsByClassName("icon");
  eraseRestore();
  setTimeout(function () {
    loader.style.display = "none";
  }, 1500);
  // console.log(attendanceList[0]);
});

submitButton.addEventListener("click", function (e) {
  // if (attendanceList[0] === undefined) {
  //   eraseRestoreBtn = document.querySelectorAll(".remove-restore span");

  // }
  // console.log(e.target);
  if (studentName.value.length < 5 || lectureName.value.length < 10) {
    e.target.setAttribute("disabled", "");
    setTimeout(function () {
      e.target.removeAttribute("disabled");
    }, 500);
  } else {
    attendanceList.push({
      name: studentName.value.trim(),
      class: lectureName.value.trim(),
      erase: false,
    });
    const newAttendance = document.createElement("div");
    newAttendance.classList.add("attendance-list");
    newAttendance.innerHTML = `<div class="attendance">
              <h3>${attendanceList[attendanceList.length - 1].name}</h3>
              <p>${attendanceList[attendanceList.length - 1].class}</p>
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
    console.log(length);
    // for (let i = length; i < attendanceContainer.children.length; i++) {
    //   if (length === 0 && i > length) {
    //     length = i;
    //   }
    //   console.log(attendanceContainer.children[i]);
    //   attendanceContainer.children[i].addEventListener(
    //     "mouseup",
    //     () => {
    //       eraseRestore();
    //     },
    //     { once: true }
    //   );
    // }
    console.log(attendanceList);
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
// console.log(attendanceContainer.querySelectorAll(".attendance-list"));
// for (let i = 0; i < attendanceContainer.children.length; i++) {
// attendanceContainer.querySelectorAll(".attendance-list").forEach((e) => {
//   console.log(e.target);
//   e.target.addEventListener("mouseenter", () => {
//     console.log("hh");
//     for (let index = 0; index < eraseRestoreBtn.length; index++) {
//       // eraseRestoreBtn.forEach((btn, index) => {
//       eraseRestoreBtn[index].addEventListener("click", (e) => {
//         // console.log(e.target.children);
//         console.log(e.target);
//         e.target.parentNode.parentNode.classList.toggle("erase");
//         if (!e.target.textContent.includes("format_ink_highlighter")) {
//           e.target.innerHTML = `
//           format_ink_highlighter
//           <span class="tooltiptext">Erase name</span>`;
//           attendanceList[index].erase = false;
//           e.target.classList.remove("restore-btn");
//         } else {
//           e.target.innerHTML = `settings_backup_restore
//         <span class="tooltiptext">Restore name</span>`;
//           e.target.classList.add("restore-btn");
//           attendanceList[index].erase = true;
//         }
//         localStorage.setItem("attendances", JSON.stringify(attendanceList));
//       });
//     }
//   });
// });
function eraseRestore() {
  // if (attendanceList[0] != undefined) {
  for (let index = 0; index < eraseRestoreBtn.length; index++) {
    // eraseRestoreBtn.forEach((btn, index) => {
    eraseRestoreBtn[index].addEventListener("click", (e) => {
      // console.log(e.target.children);
      console.log(e.target);
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
    });
  }
}

// : callToAction.classList.add("disabled")
// }
