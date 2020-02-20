const express = require('express')
const router = express.Router()
const User = require('../user')
const Courses = require('../courses')

// GET /
router.get('/', (req, res) => {
    console.log(req.session.userId)
    if(req.session.userId){
        return res.render('index', { title: 'Home', loggedIn: true, studentID: req.session.userId});
    }
    else{
        return res.render('index', { title: 'Home', loggedIn: false});
    }
    
});
router.get('/login', function(req, res, next) {
  if(req.session.userId){
      return res.redirect('/dashboard');
  }
  else{
      return res.render('login', { title: 'Log In', error: req.query.error});
  }
  
});

// GET /login
router.get('/login/student', function(req, res, next) {
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    else{
        return res.render('loginStudent', { title: 'Log In', error: req.query.error});
    }
    
});

// GET /login/instructor
router.get('/login/instructor', function(req, res, next) {
  if(req.session.userId){
      return res.redirect('/dashboard');
  }
  else{
      return res.render('loginInstructor', { title: 'Log In', error: req.query.error});
  }
  
});

// GET /logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
});


// GET /register
router.get('/register', (req, res) => {
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    else{
      console.log(req.query.error)
      return res.render('register', { title: 'Register', error: req.query.error})
    };
});

// GET /register/student
router.get('/register/student', (req, res) => {
  if(req.session.userId){
      return res.redirect('/dashboard');
  }
  else{
    console.log(req.query.error)
    return res.render('registerStudent', { title: 'Register', error: req.query.error})
  };
});

// GET /register/instructor
router.get('/register/instructor', (req, res) => {
  if(req.session.userId){
      return res.redirect('/dashboard');
  }
  else{
    console.log(req.query.error)
    return res.render('registerInstructor', { title: 'Register', error: req.query.error})
  };
});

// GET /dashboard
router.get('/dashboard', (req, res) => {
    if(!req.session.userId) res.redirect('/login')
    if(req.query.courseId){
      if(req.query.proc=="dereg"){
        User.deRegisterCourse(req.query.courseId,req.query.studentId).then(() => {
          console.log('Course De-Registered')
        }).catch((err) => {
          console.log(err)
        })
      }
      if(req.query.proc=="delCourse"){
        User.delCourse(req.query.courseId, req.query.insId).then(() => {
          console.log('Course Deleted from user!')
          Courses.delCourse(req.query.courseId).then(() => {
            console.log('Course Deleted from course list!')
            User.deRegisterCourseFromUsers(req.query.courseId).then(() => {
              console.log('Course Deleted Completely!')
            })
          })
        })
      }
    }
    
    if(req.session.userType == "student"){
      User.getStudentDetail(req.session.userId, (err, stDetail) => {
        return res.render('dashboard', { title: 'Dashboard', userType: "student", stDetail: stDetail, loggedIn: true, studentID: req.session.userId});
      })
    }
    else if(req.session.userType == "instructor"){
      User.getInstructorDetail(req.session.userId, (err, inDetail) => {
        return res.render('dashboard', { title: 'Dashboard', userType: "instructor", inDetail: inDetail, loggedIn: true, instructorID: req.session.userId});
      })
    }
});


// GET /courses
router.get('/courses', (req, res) => {
  if(!req.session.userId) res.redirect('/login')
  if(req.session.userType == 'student'){
    if(req.query.courseId){
      if(req.query.proc=="reg"){
        Courses.getCourseById(req.query.courseId).then((course) => {
          User.registerCourse(course,req.query.studentId).then(() => {
            console.log('Course Registered')
          }).catch((err) => {
            console.log(err)
          })
        })
      }  
    }
    Courses.getCourseList().then((data) => {
      User.getStudentDetail(req.session.userId, (err, stDetail) => {
        let courseReg = []
        stDetail.courses.forEach(element => {
            courseReg.push(element.courseID)
        });
        return res.render('courses', { title: 'Courses',courseReg: courseReg, courseList: data, loggedIn: true, studentID: req.session.userId});
      })
    })
  }
  else if(req.session.userType == 'instructor'){
    Courses.getCourseList().then((data) => {
      return res.render('coursesIns', { title: 'Courses', courseList: data, loggedIn: true});
    })
  }
});

// GET /courses/add
router.get('/courses/add', (req, res) => {
  if(req.session.userType != 'instructor'){
      return res.redirect('/dashboard');
  }
  else{
    console.log(req.query.error)
    return res.render('courseAdd', { title: 'Add Course', error: req.query.error})
  };
});

// POST /login/student
router.post('/login/student', (req, res, next) => {
    if (req.body.username && req.body.password) {
        User.auth(req.body.username,req.body.password, (err,user) => {
            if(err || !user){
                console.log('error')
                var err = new Error('Wrong username and password combination');
                err.status = 401;
                return res.redirect(`/login/student?error=${err}`);
            }
            else{
                req.session.userId = user.username;
                req.session.userType = 'student';
                console.log('Student Login Successful!')
                return res.redirect('/dashboard');
            }
        })
    } else {
        var err = new Error('Username and password are required.');
        err.status = 401;
        return res.redirect(`/login/student?error=${err}`);
    }
})

// POST /login/instructor
router.post('/login/instructor', (req, res, next) => {
  if (req.body.username && req.body.password) {
      User.authIns(req.body.username,req.body.password, (err,user) => {
          if(err || !user){
              console.log('error')
              var err = new Error('Wrong username and password combination');
              err.status = 401;
              return res.redirect(`/login/instructor?error=${err}`);
          }
          else{
              req.session.userId = user.username;
              req.session.userType = 'instructor';
              console.log('Instructor Login Successful!')
              return res.redirect('/dashboard');
          }
      })
  } else {
      var err = new Error('Username and password are required.');
      err.status = 401;
      return res.redirect(`/login/instructor?error=${err}`);
  }
})


// POST /courses/add
router.post('/courses/add', function(req, res, next) {
  if (req.body.name &&
    req.body.courseCode) {

      // create object with form input
      var courseData = {
        courseID: 0,
        courseCode: req.body.courseCode,
        courseName: req.body.name,
        courseFaculty: ''
      };

      User.getInstructorDetail(req.session.userId, (err, inDetail) => {
        courseData.courseFaculty = inDetail.name
        User.checkCourse(courseData, inDetail).then(() => {
          // insert data to json file
          Courses.addToJson(courseData,'courses.json', (err,newCourse) => {
            if(err || !newCourse) console.log(err)
            else {
              User.addCourse(newCourse, inDetail).then(() => {
                console.log('Course Added');
                return res.redirect('/dashboard');
              })
            }
          })
        })
        .catch((err) => {
          return res.redirect(`/courses/add?error=${err}`);
        })
      })
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return res.redirect(`/courses/add?error=${err}`);
    }
})





// POST /register/student
router.post('/register/student', function(req, res, next) {
  if (req.body.studentID &&
    req.body.name &&
    req.body.degree &&
    req.body.branch &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return res.redirect(`/register/student?error=${err}`);
      }

      // create object with form input
      var userData = {
        studentID: req.body.studentID,
        username: req.body.studentID,
        password: req.body.password,
        name: req.body.name,
        degree: req.body.degree,
        branch: req.body.branch,
        courseCount:0,
        courses: []
      };

      User.checkData(userData).then(() => {
        // insert data to json file
        User.addToJson(userData,'student.json', (err,status) => {
          if(err || !status) console.log(err)
          else console.log('User Added');
          return res.redirect('/login');
        })
      })
      .catch((err) => {
        return res.redirect(`/register/student?error=${err}`);
      })
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return res.redirect(`/register/student?error=${err}`);
    }
})


// POST /register/instructor
router.post('/register/instructor', function(req, res, next) {
  if (req.body.name &&
    req.body.username &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return res.redirect(`/register/instructor?error=${err}`);
      }

      // create object with form input
      var insData = {
        insID: 0,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        coursesCount: 0,
        courses: []
      };

      User.checkDataIns(insData).then(() => {
        // insert data to json file
        User.addToJsonIns(insData,'instructor.json', (err,status) => {
          if(err || !status) console.log(err)
          else console.log('User Added');
          return res.redirect('/login');
        })
      })
      .catch((err) => {
        return res.redirect(`/register/instructor?error=${err}`);
      })
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return res.redirect(`/register/instructor?error=${err}`);
    }
})

module.exports = router;