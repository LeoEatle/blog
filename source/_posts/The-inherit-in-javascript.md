---
title: The inherit in javascript
date: 2016-09-02 14:53:57
subtitle: "读红宝书有感"
tags:
    - javascirpt
    - 函数式编程	
---
```
/**
 * Created by leoeatle on 16/9/2.
 */
function Person(name){
    this.name = name;
    this.age = 20;

}
Person.prototype.walk = function () {
    console.log(this.name + " is walking");
}

function Student(name) {
    Person.apply(this, arguments);
    console.log(arguments);


}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.speak = function () {
    console.log(this.name + " is speaking");
}

student1 = new Student("Leo");
student1.speak();
student1.walk();
console.log("my age is "+ student1.age);

student2 = new Student("Lara");
student2.age = 30;
console.log("student1 age: " + student1.age);
console.log("Student2 age: " + student2.age);
//student1.sayGoodBye();
```