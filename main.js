'use strict'

// Variables for HTML Elements

const form = document.querySelector('logInForm');
const inputText = document.querySelector('#userName'); // username input from text box
const inputPassword = document.querySelector('#userPass'); // user password input

const inputTextNumber = document.querySelector('#txtNumber');
const inputTextName = document.querySelector('#txtName');
const inputTextTeacher = document.querySelector('#txtTeacher');
const inputTextHours = document.querySelector('#txtHours');



// LogInPage - if stored data from RegForm is equal to entered data -> store the user in sessionStorage


function logIn() {

    var user = {
        userName : inputText.value,
        password : inputPassword.value
    }

    var userObj = JSON.stringify(user) ;

    var users = [] ;
    users = JSON.parse(localStorage.getItem('registerUser') || "[]");

    for (let i= 0; i < users.length; i++) {
        if (user.userName == users[i].localUserName && user.password == users[i].localUserPass) {
            sessionStorage.setItem('userKey', userObj);
            return true;
        }
    }
    alert('שם המשתמש או הסיסמה אינם נכונים!');
    return false ;
    
};

// Reg Form

function register() {
    
    var usernameReg = document.querySelector('#regName'); // username input from reg form
    var passwordReg = document.querySelector('#regPass'); // user password from reg form

    var registerUser = {
        localUserName : usernameReg.value,
        localUserPass : passwordReg.value
    };
    
    var usersGet = [] ;
    usersGet = JSON.parse(localStorage.getItem('registerUser') || "[]");

    if (validateReg() == true) { 
    
    for (let i= 0; i < usersGet.length; i++) {
        if (registerUser.localUserName == usersGet[i].localUserName && registerUser.localUserPass == usersGet[i].localUserPass) {
            alert('משתמש קיים במערכת');
            return ;
        }
    }
    usersGet.push(registerUser) ;
    localStorage.setItem("registerUser", JSON.stringify(usersGet));
    }
}


// Form Validations

function validateReg() {

    var pass1 = document.forms['regForm']['regPass'].value;
    var pass2 = document.forms['regForm']['regConPass'].value;
    var un = document.forms['regForm']['regName'].value;
    
    // validation fails if the input is blank
    if (un == "" || pass1 == "" || pass2 == "") {
        alert("יש למלא את כל השדות");
        // document.forms['regForm'].un.focus();
        return false;
    }
    // validation fails if confirm password do not match
    if (pass1 != pass2) {
        alert('ססמה לא מתאימה, נסה שוב.');
        return false;
    }
    

    return true ;
    
};


function validateFormLogIn() {

    var inputText = document.forms['logInForm']['#userName'].value;
    var inputPassword = document.forms['logInForm']['#userPass'].value;

    if (inputText == "") {
      alert("יש להכניס שם משתמש");
      return false;
    }
    if (inputPassword == "") {
       alert("יש להכניס ססמא");
       return false;
    }
    return true;
  }

// CoursePage - Edit Existing course OR Save new course to localStorge

var welcome = sessionStorage.getItem('userKey');
var validUser = JSON.parse(welcome || '{}');
var hello = document.getElementById('hello') ;
if (hello != null) {
    hello.innerHTML = validUser.userName;
}



console.log(window.location.pathname);
var link = window.location.pathname.split("/").pop() ;
if (link == 'CoursePage.html') {
    
    var updateCourse = JSON.parse(sessionStorage.getItem('updateInfo') || '{}' );
    if (updateCourse.updateMode == true) {
        var i = updateCourse.I;
        var x = updateCourse.X;
        var packages = [];
        packages = JSON.parse(localStorage.getItem('packages'));
        document.getElementById('txtNumber').value = packages[i].coursesList[x].courseNumber;  
        document.getElementById('txtName').value = packages[i].coursesList[x].courseName;  
        document.getElementById('txtTeacher').value = packages[i].coursesList[x].courseTeach;  
        document.getElementById('txtHours').value = packages[i].coursesList[x].courseHours;  
    }

}




function SaveData() {

    // Case 1- User is updating an Existing course

    // Case 2- User is saving new course into localStorage
    
    var myCourse = {
    
        courseNumber: inputTextNumber.value,
        courseName: inputTextName.value,
        courseHours: inputTextHours.value,
        courseTeach: inputTextTeacher.value
    }

    var packages = [];
    packages = JSON.parse(localStorage.getItem('packages') || '[]');
    
    

    for (var i= 0; i < packages.length; i++) {
       if (validUser.userName == packages[i].userID.userName && validUser.password == packages[i].userID.password) {
           break;
       }   
    }

    var pack = packages[i] || {} ;
    var list = pack.coursesList || [] ;

    if (updateCourse.updateMode == true) {
        packages[i].coursesList[x] = myCourse ;
        document.getElementById("frmCourse").reset() ;
        updateCourse.updateMode = false ;
        sessionStorage.setItem(('updateInfo'), JSON.stringify(updateCourse)) ;
        alert('הקורס התעדכן בהצלחה');
        var Cupdated = true ;
    }
    else {
        list.push(myCourse);
        alert('הקורס נוסף בהצלחה');
    }
    
    pack.coursesList = list ;
    pack.userID = validUser ;
    packages[i] = pack ;
    

    localStorage.setItem(('packages'), JSON.stringify(packages));

    if (Cupdated) {
        window.location = "CourseInfo.html";
    }
 
}

function ClearAll() {
    document.getElementById('txtNumber').value = "";  
    document.getElementById('txtName').value = "";
    document.getElementById('txtTeacher').value = "";
    document.getElementById('txtHours').value = "";
}




// CourseInfo - Table

function newFunction(list, i) {
    var table = document.getElementById("tblCourses");

    for (let x = 0; x < list.length; x++) {
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        

        cell1.innerHTML = list[x].courseNumber;
        cell2.innerHTML = list[x].courseName;
        cell3.innerHTML = list[x].courseTeach;
        cell4.innerHTML = list[x].courseHours;
        
        var edit = document.createElement("button");
        edit.innerHTML = "עריכה";
        edit.setAttribute("onclick", `editCourse(${x}, ${i})`);
        cell5.appendChild(edit);
        
        var del = document.createElement("button");
        del.innerHTML = "מחק";
        del.setAttribute("onclick", `deleteCourse(${x}, ${i})`);
        cell6.appendChild(del);
    }
}

function deleteCourse(x, i) {

    var c = confirm("אנא אשר את מחיקת הקורס מהרשימה");
    if (c === false) {
        return;
    }
    
    var packages = [];
    packages = JSON.parse(localStorage.getItem('packages'));
    packages[i].coursesList.splice(x, 1);
    localStorage.setItem(('packages'), JSON.stringify(packages));

    location.reload();
}

function editCourse(x, i) {

    var updateInfo = {
        updateMode : true,
        X : x,
        I : i
    }
    sessionStorage.setItem(('updateInfo'), JSON.stringify(updateInfo));
    window.location = "CoursePage.html";
    
}

function getInfo(){
    
    var packages = [];
    packages = JSON.parse(localStorage.getItem('packages') || '[]');

    for (var i= 0; i < packages.length; i++) {
        if (validUser.userName == packages[i].userID.userName && validUser.password == packages[i].userID.password ) {
            console.log("Valid User");
            newFunction(packages[i].coursesList, i);

        }   
    }
}


    

    


























