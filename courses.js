const fs = require('fs')
const coursesData = require('./data/courses.json')

function getCourseList(){
    var promise = new Promise((resolve, reject) => {
        var err = null
        if(!coursesData.courses) {
            err = 'There is some error in retreiving courses, please try after some time.'
            return reject(err)
        }
        else{
            return resolve(coursesData.courses)
        }
    })
    return promise
}

function getCourseById(id){
    var promise = new Promise((resolve, reject) => {
        var err = null
        var status = null
        coursesData.courses.forEach(element => {
            if(element.courseID == id) {
                status = 'success'
                return resolve(element)
            }
        });
        if(!status){
            err = 'No such Course Exists'
            return reject(err)
        }
    })
    return promise
}

function addToJson(newData, filename, callback){
    var promise = new Promise((resolve, reject) =>{
        var stat = fs.readFile(`./data/${filename}`, 'utf8', function readFileCallback(err, data){
            if (err){
                return reject(err);
            } else {
                obj = JSON.parse(data); //now it an object
                newData.courseID = obj.lastCourseID+1
                obj.courses.push(newData); //add some data
                obj.totalCourses++
                obj.lastCourseID++
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFileSync(`./data/${filename}`, json, 'utf8'); // write it back
                return resolve(newData)
            }
        })
    }).then((newCourseData) => {
        return callback(null,newCourseData)
    })
}

function delCourse(courseId){
    const promise = new Promise((resolve, reject) => {
        var err = null
        var ind = null
        var i = 0
        coursesData.courses.forEach(element => {
            if(element.courseID == courseId){
                ind = i
            }
            i++
        })
        if(ind != null){
            coursesData.courses.splice(ind,1)
            coursesData.totalCourses--
            json = JSON.stringify(coursesData); //convert it back to json
            fs.writeFileSync(`./data/courses.json`, json, 'utf8'); // write it back*/
        }
        if(!err){
            return resolve()
        }
    });

    return promise;
}



module.exports.getCourseList = getCourseList
module.exports.getCourseById = getCourseById
module.exports.addToJson= addToJson
module.exports.delCourse = delCourse