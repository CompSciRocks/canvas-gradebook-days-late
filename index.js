// Copyright 2024 Ryan Nutt / CompSci.rocks
// This code is licensed under the GPL v3.0 license.
// https://www.gnu.org/licenses/gpl-3.0.html
//
// For more information, visit https://compsci.rocks

// Get course ID
let courseID = ENV.current_context.id;
let host = location.protocol + '//' + location.host;
console.info('courseID', courseID);
console.info('host', host);

let interval = setInterval(function () {
    let lateEls = document.querySelectorAll('.gradebook-cell.late');
    lateEls.forEach(function (el) {
        let endEl = el.querySelector('.Grid__GradeCell__EndContainer');
        if (endEl.innerHTML.trim() == '') {
            let parentCell = endEl.closest('.slick-cell');
            let assignmentID = '';
            if (parentCell) {
                parentCell.classList.forEach(function (className) {
                    if (className.includes('assignment_')) {
                        assignmentID = className.replace('assignment_', '');
                    }
                });
            }

            let studentID = '';
            let studentEl = endEl.closest('.slick-row');
            if (studentEl) {
                studentEl.classList.forEach(function (className) {
                    if (className.includes('student_')) {
                        studentID = className.replace('student_', '');
                    }
                });
            }


            if (studentID && assignmentID) {
                let url = `${host}/api/v1/courses/${courseID}/assignments/${assignmentID}/submissions/${studentID}`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.late) {
                            let daysLate = Math.round(data.seconds_late / 60 / 60 / 24 * 100) / 100;
                            endEl.innerHTML = '<span style="font-size:75%;">(' + daysLate + ')</span>';
                        }
                    });
            }
        }
    });
}, 2_500);