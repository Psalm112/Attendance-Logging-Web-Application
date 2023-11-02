import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Attendance from "./Components/Attendance.jsx";
import "./App.css";

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const attendanceRef = useRef(null);
  const [attendances, setAttendances] = useState([]);
  const months = [
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
  const [attendanceList, setAttendanceList] = useState([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  // When the web page window is loaded previously saved attendances if available are fetched from the localstorage to be displayed
  useEffect(() => {
    const storedAttendances = localStorage.getItem("attendances");
    if (storedAttendances) {
      const parsedAttendances = JSON.parse(storedAttendances);
      setAttendanceList(parsedAttendances);
    }
    setTimeout(() => {
      setIsStorageLoaded(true);
    }, 1500);
    return () => {
      setAttendanceList([]);
    };
  }, []);

  // The submit attendance button to add the filled name and class to the attendance with the time it was added
  const onSubmit = (data) => {
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
    setAttendanceList([
      ...attendanceList,
      {
        name: data.name.trim(),
        class: data.courseTitle.trim(),
        erase: false,
        entryTime: currentDateTIme,
      },
    ]);
    reset({
      name: "",
      courseTitle: "",
    });
  };
  useEffect(() => {
    if (isStorageLoaded) {
      localStorage.setItem("attendances", JSON.stringify(attendanceList));
    }
  }, [attendanceList]);

  // Search functionality
  const [isNotSearchResult, setIsNotSearchResult] = useState([]);
  const searchAttendance = (e) => {
    const regex = new RegExp(e.target.value.trim().toLowerCase(), "gi");
    const notMatch = attendanceList.reduce((acc, attendance, i) => {
      if (!attendance.name.match(regex)) {
        acc.push(i);
      }
      return acc;
    }, []);
    setIsNotSearchResult(notMatch);
  };

  // Filtering attendances (all, crossed, not crossed)
  const [isNotFilterResult, setIsNotFilterResult] = useState([]);
  const filterAttendance = (e) => {
    setIsNotFilterResult([]); // Reset the filter result array for both cases
    if (e.target.value === "crossed") {
      const notMatch = attendanceList.reduce((acc, attendance, i) => {
        if (!attendance.erase) {
          acc.push(i);
        }
        return acc;
      }, []);
      setIsNotFilterResult(notMatch);
    } else if (e.target.value === "uncrossed") {
      const notMatch = attendanceList.reduce((acc, attendance, i) => {
        if (attendance.erase) {
          acc.push(i);
        }
        return acc;
      }, []);
      setIsNotFilterResult(notMatch);
    }
  };

  return (
    <>
      <div className="main-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>
              <h1>class Attendance Logging</h1>
              <span className="call-to-action">
                <i>Fill your class attendance below</i>
              </span>
            </legend>
            <div>
              <label>
                Student Full Name:
                <br />
                <input
                  {...register("name", {
                    required: "Input your names",
                    minLength: {
                      value: 5,
                      message:
                        "Input your first and last name. Your middle name is optional",
                    },
                    pattern: {
                      value: /^[A-Za-z]+ [A-Za-z]+ ?([A-Za-z]+)?$/,
                      message:
                        "Input your first and last name. Your middle name is optional",
                    },
                  })}
                  // type="text"
                  id="name"
                  placeholder="Samuel Oyenuga"
                  autoComplete="name"
                  // required
                />
                <br />
                {errors.name && (
                  <span>
                    <p className="warning-msg">
                      <i>{errors.name.message}</i>
                    </p>
                  </span>
                )}
              </label>
              <label>
                Class (course code and title):
                <br />
                <input
                  {...register("courseTitle", {
                    required:
                      "Input the course code and title of the lecture in progress. Including the course title is optional",
                    pattern: {
                      value: /^([A-Za-z]{3})+ ?(\d{3}) ?(-? ?[A-Za-z]+)?$/,
                      message: `Enter the course code and title of the lecture properly.
                      Hint: EEE 405 - Embedded Systems and Automation`,
                    },
                  })}
                  // type="text"
                  placeholder="EEE 405 - Embedded Systems and Automation"
                  id="class"
                  // required
                />
                <br />
                {errors.courseTitle && (
                  <span>
                    <p className="warning-msg">
                      <i>{errors.courseTitle.message}</i>
                    </p>
                  </span>
                )}
              </label>
            </div>
            <div className="submit-container">
              <input type="submit" value="Submit" id="submit-btn" />
            </div>
          </fieldset>
        </form>
        <div className="container">
          <div className="filter-search">
            <div className="search">
              <input
                onChange={(e) => {
                  if (e.target.value.trim().toLowerCase() === "") {
                    setIsNotSearchResult([]);
                  } else {
                    searchAttendance(e);
                  }
                }}
                type="text"
                placeholder="find names"
                id="search-box"
              />
              <span className="material-symbols-outlined"> search </span>
            </div>
            <div className="filter">
              <select
                onChange={(e) => {
                  filterAttendance(e);
                }}
                name="dropdown"
                id="filter-dropdown"
              >
                <option value="all">All</option>
                <option value="crossed">Crossed</option>
                <option value="uncrossed">Not Crossed</option>
              </select>
            </div>
          </div>

          {!isStorageLoaded && (
            <div id="loader">
              <div className="attendance-loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}

          <div ref={attendanceRef} className="attendance-list-container">
            <Attendance
              attendanceList={attendanceList}
              isNotSearchResult={isNotSearchResult}
              isNotFilterResult={isNotFilterResult}
              isStorageLoaded={isStorageLoaded}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
