(function () {
    'use strict';

    // Get course ID
    let courseID = ENV.current_context.id;
    let host = location.protocol + '//' + location.host;

    let interval = setInterval(function () {
        let lateEls = document.querySelectorAll('.gradebook-cell.late');
        lateEls.forEach(function (el) {
            let endEl = el.querySelector('.Grid__GradeCell__EndContainer');
            if (!endEl.innerHTML) {
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

                console.log('courseID', courseID);
                console.log('studentID', studentID);
                console.log('assignmentID', assignmentID);


                if (studentID && assignmentID) {
                    let url = `${host}/api/v1/courses/${courseID}/assignments/${assignmentID}/submissions/${studentID}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.late) {
                                let daysLate = Math.round(data.seconds_late / 60 / 60 / 24 * 100 / 100);
                                endEl.innerHTML = '<span style="font-size:75%;">(' + daysLate + ')</span>';
                            }
                        });
                }
            }
        });
    }, 2_500);
})