# E-Learning Web Application
### Mini-Project 1 (PayPal VAP)
A system developed using  `Node.Js`  and  `Pug`  for universities to bring their courses online. The system supports `student`  and `instructor` user types.

## Getting Started
**Requirements:**

- Node.js 12.14.1 or above
 
**How to Run:**

* Clone this GitHub repo to 'dir'
* Navigate to 'dir'
* Run `npm install` to install the dependencies
* Run `nodemon .\app.js` or `npm start` to start a server instance of the project

## Sample Credentials

| username   | password | user type|
|------------|----------|-------------|
| instructor1| 1234     | Instructor  |
| instructor2| 1234     | Instructor  |
| student1   | 1234     | Student     |
| student2   | 1234     | Student     |

## Concepts Applied

* **express.js** - web app framework
*  **pug** - view engine
*  **promises**

## Features

*  Proper validations are performed and the responses include well defined messages.
*   The system supports sessions to keep track of users and services.
*   Then data for instructors, courses and students are stored in `json` file format.

### Types of users: 

#### Student
The `dashboard` page for student
 * lists **'Courses Enrolled'** - courses to which the student has registered

Selecting a course and clicking **'De-Register'** button will de-register the course for the student.

The `course` page for student
* lists course Name, course Code and the instructor taking the course for all the courses.
* provides facility to `Register` to the course if the student is not already subscribed to the course.
* lists the courses to which the student has already registered, marked as `Registered`.

#### Instructor
The `dashboard` page for faculty
* provides facility to `add` a new course
  Inputs required: `courseCode`, `courseName`. If the instructor tries to create a course with existing courseCode, a new course will be created with new instructor. If the instructor tries to create two courses with same courseCode, the instructor will be alerted with an error message saying the course already exists under his name.
 * lists **'Courses Created'** - courses which the instructor has created

* Selecting a course and clicking **'Delete Course'** button will delete the course record along with all registrations from students.

The `courses` page for faculty
*	lists course Name, course Code and the instructor taking the course for all the courses.