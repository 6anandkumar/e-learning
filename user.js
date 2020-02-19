const fs = require('fs')
const studentData = require('./data/student.json')
const instructorData = require('./data/instructor.json')

var authenticate = function(username, password, callback){
    var numOfStudents = Object.keys(studentData.students).length
    //console.log(numOfStudents)
    let count = 0
    let flag = 0
    studentData.students.forEach(element => {
        count++
        if(username === element.username && password === element.password){
            flag = 1
            return callback(null,element)
        }
    })
    if( count >= numOfStudents && flag == 0) return callback('No such user found')
}

var getStudentDetail = function(username, callback){
    var courses = []
    studentData.students.forEach(element => {
        if(username === element.username){
            //console.log(element.courses)
            return callback(null,element)
        }
    })

}

var addToJson = async function(newData, filename, callback){
    var stat = await fs.readFile(`./data/${filename}`, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.students.push(newData); //add some data
            obj.studentCount++
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFileSync(`./data/${filename}`, json, 'utf8'); // write it back
            return 
        }
    });
    return callback(null,'success')
}

var addToJsonIns = async function(newData, filename, callback){
    var stat = await fs.readFile(`./data/${filename}`, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data);
            newData.insID = obj.lastInsId + 1 //now it an object
            obj.instructors.push(newData); //add some data
            obj.instructorCount++
            obj.lastInsId++
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFileSync(`./data/${filename}`, json, 'utf8'); // write it back
            return 
        }
    });
    return callback(null,'success')
}



function checkData(data){
    const promise = new Promise((resolve, reject) => {
        var err = null
        studentData.students.forEach(element => {
            if(data.username === element.username){
                //console.log(element.courses)
                err = 'User already exists!'
                return reject(err)
            }
        })
        if(!err){
            return resolve()
        }
    });
    return promise;
}

function checkDataIns(data){
    const promise = new Promise((resolve, reject) => {
        var err = null
        instructorData.instructors.forEach(element => {
            if(data.username === element.username){
                //console.log(element.courses)
                err = 'User already exists!'
                return reject(err)
            }
        })
        if(!err){
            return resolve()
        }
    });
    return promise;
}

function registerCourse(course,stId){
    const promise = new Promise((resolve, reject) => {
        var err = null
        studentData.students.forEach(element => {
            if(stId === element.username){
                /*if(element.courses.includes(course)){
                    err = 'Course already registered'
                    console.log(err)
                    return reject(err)
                }*/
                element.courses.push(course)
                element.courseCount++
                //console.log(element)
            }
            //console.log(studentData)
            json = JSON.stringify(studentData); //convert it back to json
            fs.writeFileSync(`./data/student.json`, json, 'utf8'); // write it back
        })
        if(!err){
            return resolve()
        }
    });

    return promise;
}

function deRegisterCourse(csId, stId){
    const promise = new Promise((resolve, reject) => {
        var err = null
        studentData.students.forEach(element => {
            var ind = null
            if(stId === element.username){
                for(var i=0;i<element.courses.length;i++){
                    if(element.courses[i].courseID == csId){
                        ind = i
                    }
                }
                element.courses.splice(ind,1)
                element.courses.courseCount--
            }
            //console.log(studentData)
            json = JSON.stringify(studentData); //convert it back to json
            fs.writeFileSync(`./data/student.json`, json, 'utf8'); // write it back*/
        })
        if(!err){
            return resolve()
        }
    });

    return promise;
}

function authIns(username, password, callback){
    var numOfIns = Object.keys(instructorData.instructors).length
    //console.log(numOfStudents)
    let count = 0
    let flag = 0
    instructorData.instructors.forEach(element => {
        count++
        if(username === element.username && password === element.password){
            flag = 1
            return callback(null,element)
        }
    })
    if( count >= numOfIns && flag == 0) return callback('No such user found')
}

var getInstructorDetail = function(username, callback){
    var courses = []
    instructorData.instructors.forEach(element => {
        if(username === element.username){
            //console.log(element.courses)
            return callback(null,element)
        }
    })
}


function checkCourse(courseData, inDetail){
    //console.log(courseData)
    const promise = new Promise((resolve, reject) => {
        var err = null
        instructorData.instructors.forEach(element => {
            if(inDetail.username === element.username){
                element.courses.forEach(item => {
                    if(item.courseCode === courseData.courseCode){
                        err = 'Course already exists!'
                        return reject(err)
                    }
                })
            }
        })
        if(!err){
            return resolve()
        }
    });

    return promise;
}

function addCourse(newCourse,inDetail){
    const promise = new Promise((resolve, reject) => {
        var err = null
        instructorData.instructors.forEach(element => {
            if(inDetail.username === element.username){

                element.courses.push(newCourse)
                element.coursesCount++
            }
            //console.log(studentData)
            json = JSON.stringify(instructorData); //convert it back to json
            fs.writeFileSync(`./data/instructor.json`, json, 'utf8'); // write it back
        })
        if(!err){
            return resolve()
        }
    });

    return promise;
}

function delCourse(courseId, insId){
    const promise = new Promise((resolve, reject) => {
        var err = null
        instructorData.instructors.forEach(element => {
            var ind = null
            if(insId == element.insID){
                for(var i=0;i<element.courses.length;i++){
                    if(element.courses[i].courseID == courseId){
                        ind = i
                    }
                }
                //console.log(ind)
                element.courses.splice(ind,1)
                element.courses.coursesCount--
            }
            json = JSON.stringify(instructorData); //convert it back to json
            fs.writeFileSync(`./data/instructor.json`, json, 'utf8'); // write it back*/
        })
        if(!err){
            return resolve()
        }
    });

    return promise;
}


module.exports.auth = authenticate
module.exports.getStudentDetail = getStudentDetail
module.exports.addToJson = addToJson
module.exports.checkData = checkData
module.exports.registerCourse = registerCourse
module.exports.deRegisterCourse = deRegisterCourse
module.exports.authIns = authIns
module.exports.getInstructorDetail = getInstructorDetail
module.exports.checkCourse  = checkCourse
module.exports.addCourse = addCourse
module.exports.delCourse = delCourse
module.exports.checkDataIns = checkDataIns
module.exports.addToJsonIns = addToJsonIns