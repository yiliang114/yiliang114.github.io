---
title: 类型转换
date: '2020-11-02'
draft: true
---

### 变量提升

```js
var employeeId = 'abc123';

function foo() {
  employeeId = '123bcd';
  return;

  function employeeId() {}
}
foo();
console.log(employeeId);
// abc123
```

```js
var employeeId = 'abc123';

function foo() {
  employeeId();
  return;

  function employeeId() {
    console.log(typeof employeeId);
  }
}
foo();
// function
```

```js
function foo() {
  employeeId();
  var product = 'Car';
  return;

  function employeeId() {
    console.log(product);
  }
}
foo();
// undefined
```

```js
(function() {
  'use strict';

  var person = {
    name: 'John',
  };
  person.salary = '10000$';
  person['country'] = 'USA';

  Object.defineProperty(person, 'phoneNo', {
    value: '8888888888',
    enumerable: true,
  });

  console.log(Object.keys(person));
})();
// ["name", "salary", "country", "phoneNo"]
```

```js
(function() {
  'use strict';

  var person = {
    name: 'John',
  };
  person.salary = '10000$';
  person['country'] = 'USA';

  Object.defineProperty(person, 'phoneNo', {
    value: '8888888888',
    enumerable: false,
  });

  console.log(Object.keys(person));
})();
// ["name", "salary", "country"]
```

```js
(function() {
  var objA = {
    foo: 'foo',
    bar: 'bar',
  };
  var objB = {
    foo: 'foo',
    bar: 'bar',
  };
  console.log(objA == objB);
  console.log(objA === objB);
})();
// false false
```

```js
function mul(x) {
  return function(y) {
    return {
      result: x * y,
      sum: function(z) {
        return x * y + z;
      },
    };
  };
}
console.log(mul(2)(3).result);
console.log(mul(2)(3).sum(4));

//  6, 10
```

```js
function mul(x) {
  return function(y) {
    return [
      x * y,
      function(z) {
        return x * y + z;
      },
    ];
  };
}

console.log(mul(2)(3)[0]);
console.log(mul(2)(3)[1](4));

// 6, 10
```

```js
function getNumber() {
  return;
}

var numb = getNumber();
console.log(numb);
// undefined
```

```js
function getNumber() {
  return 2, 4, 5;
}

var numb = getNumber();
console.log(numb);
// 5 最后一个值就是 return 回的值
```

```js
(function() {
  function sayHello() {
    var name = 'Hi John';
    return;
    {
      fullName: name;
    }
  }
  console.log(sayHello().fullName);
})();
// 需要在同一行
// Uncaught TypeError: Cannot read property 'fullName' of undefined
```

```js
(function() {
  var arrayNumb = [2, 8, 15, 16, 23, 42];
  Array.prototype.sort = function(a, b) {
    return a - b;
  };
  arrayNumb.sort();
  console.log(arrayNumb);
})();
(function() {
  var numberArray = [2, 8, 15, 16, 23, 42];
  numberArray.sort(function(a, b) {
    if (a == b) {
      return 0;
    } else {
      return a < b ? -1 : 1;
    }
  });
  console.log(numberArray);
})();
(function() {
  var numberArray = [2, 8, 15, 16, 23, 42];
  numberArray.sort(function(a, b) {
    return a - b;
  });
  console.log(numberArray);
})();

// [ 2, 8, 15, 16, 23, 42 ]
// [ 2, 8, 15, 16, 23, 42 ]
// [ 2, 8, 15, 16, 23, 42 ]
```

```js
function getDataFromServer(apiUrl) {
  var name = 'John';
  return {
    then: function(fn) {
      fn(name);
    },
  };
}

getDataFromServer('www.google.com').then(function(name) {
  console.log(name);
});
// John
```

```js
(function greetNewCustomer() {
  console.log('Hello ' + this.name);
}.bind({
  name: 'John',
})());
// Hello John
```

```js
(function() {
  var fooAccount = {
    name: 'John',
    amount: 6000,
    deductAmount: function(amount) {
      this.amount -= amount;
      return this.amount;
    },
  };
  var barAccount = {
    name: 'John',
    amount: 4000,
  };
  var withdrawAmountBy = function(totalAmount) {
    return fooAccount.deductAmount.call(barAccount, totalAmount);
  };
  console.log(withdrawAmountBy(400));
  console.log(withdrawAmountBy(300));
  console.log(withdrawAmountBy(200));
})();

// 4000 - 400
// 3600 - 300
// 3300 - 200
// 3600 3300 3100
```

```js
(function() {
  var objA = new Object({ foo: 'foo' });
  var objB = new Object({ foo: 'foo' });
  console.log(objA == objB);
  console.log(objA === objB);
})();
// false false
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = Object.create({
    foo: 'foo',
  });
  console.log(objA == objB);
  console.log(objA === objB);
})();
// false false
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = Object.create(objA);
  console.log(objA == objB);
  console.log(objA === objB);
})();
// false false
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = Object.create(objA);
  console.log(objA.toString() == objB.toString());
  console.log(objA.toString() === objB.toString());
})();
//  true true
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = objA;
  console.log(objA == objB);
  console.log(objA === objB);
  console.log(objA.toString() == objB.toString());
  console.log(objA.toString() === objB.toString());
})();
// true true true true
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = objA;
  objB.foo = 'bar';
  console.log(objA.foo);
  console.log(objB.foo);
})();
// bar bar
```

```js
(function() {
  var objA = Object.create({
    foo: 'foo',
  });
  var objB = objA;
  objB.foo = 'bar';

  delete objA.foo;
  console.log(objA.foo);
  console.log(objB.foo);
})();
// foo foo
```

```js
(function() {
  var objA = {
    foo: 'foo',
  };
  var objB = objA;
  objB.foo = 'bar';

  delete objA.foo;
  console.log(objA.foo);
  console.log(objB.foo);
})();
// undefined undefined
```

```js
(function() {
  var array = new Array('100');
  console.log(array);
  console.log(array.length);
})();
// ["100"] 1
```

```js
(function() {
  var array1 = [];
  var array2 = new Array(100);
  var array3 = new Array(['1', 2, '3', 4, 5.6]);
  console.log(array1);
  console.log(array2);
  console.log(array3);
  console.log(array3.length);
})();
// [] [] [Array[5]] 1
```

```js
(function() {
  var array = new Array('a', 'b', 'c', 'd', 'e');
  array[10] = 'f';
  delete array[10];
  console.log(array.length);
})();
// 11
```

```js
(function() {
  var animal = ['cow', 'horse'];
  animal.push('cat');
  animal.push('dog', 'rat', 'goat');
  console.log(animal.length);
})();
//  6
```

```js
(function() {
  var animal = ['cow', 'horse'];
  animal.push('cat');
  animal.unshift('dog', 'rat', 'goat');
  console.log(animal);
})();
// [ 'dog', 'rat', 'goat', 'cow', 'horse', 'cat' ]
```

```js
(function() {
  var array = [1, 2, 3, 4, 5];
  console.log(array.indexOf(2));
  console.log([{ name: 'John' }, { name: 'John' }].indexOf({ name: 'John' }));
  console.log([[1], [2], [3], [4]].indexOf([3]));
  console.log('abcdefgh'.indexOf('e'));
})();
// 1 -1 -1 4
```

```js
(function() {
  var array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6];
  console.log(array.indexOf(2));
  console.log(array.indexOf(2, 3));
  console.log(array.indexOf(2, 10));
})();
//  1 6 -1
```

```js
(function() {
  var numbers = [2, 3, 4, 8, 9, 11, 13, 12, 16];
  var even = numbers.filter(function(element, index) {
    return element % 2 === 0;
  });
  console.log(even);

  var containsDivisibleby3 = numbers.some(function(element, index) {
    return element % 3 === 0;
  });

  console.log(containsDivisibleby3);
})();
// [ 2, 4, 8, 12, 16 ] true
```

```js
(function() {
  var containers = [2, 0, false, '', '12', true];
  var containers = containers.filter(Boolean);
  console.log(containers);
  var containers = containers.filter(Number);
  console.log(containers);
  var containers = containers.filter(String);
  console.log(containers);
  var containers = containers.filter(Object);
  console.log(containers);
})();

// [ 2, '12', true ]
// [ 2, '12', true ]
// [ 2, '12', true ]
// [ 2, '12', true ]
```

```js
(function() {
  var list = ['foo', 'bar', 'john', 'ritz'];
  console.log(list.slice(1));
  console.log(list.slice(1, 3));
  console.log(list.slice());
  console.log(list.slice(2, 2));
  console.log(list);
})();
// [ 'bar', 'john', 'ritz' ]
// [ 'bar', 'john' ]
// [ 'foo', 'bar', 'john', 'ritz' ]
// []
// [ 'foo', 'bar', 'john', 'ritz' ]
```

```js
(function() {
  var list = ['foo', 'bar', 'john'];
  console.log(list.splice(1));
  console.log(list.splice(1, 2));
  console.log(list);
})();
// [ 'bar', 'john' ] [] [ 'foo' ]
```

```js
(function() {
  var arrayNumb = [2, 8, 15, 16, 23, 42];
  arrayNumb.sort();
  console.log(arrayNumb);
})();
// [ 15, 16, 2, 23, 42, 8 ]
```

```js
function funcA() {
  console.log('funcA ', this);
  (function innerFuncA1() {
    console.log('innerFunc1', this);
    (function innerFunA11() {
      console.log('innerFunA11', this);
    })();
  })();
}

console.log(funcA());
// funcA  Window {...}
// innerFunc1 Window {...}
// innerFunA11 Window {...}
```

```js
var obj = {
  message: 'Hello',
  innerMessage: !(function() {
    console.log(this.message);
  })(),
};

console.log(obj.innerMessage);
// undefined true
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    return this.message;
  },
};

console.log(obj.innerMessage());
// Hello
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    (function() {
      console.log(this.message);
    })();
  },
};
console.log(obj.innerMessage());
// undefined
```

```js
var obj = {
  message: 'Hello',
  innerMessage: function() {
    var self = this;
    (function() {
      console.log(self.message);
    })();
  },
};
console.log(obj.innerMessage());
// Hello
```

```js
function myFunc() {
  console.log(this.message);
}
myFunc.message = 'Hi John';

console.log(myFunc());
// undefined
```

```js
function myFunc() {
  console.log(myFunc.message);
}
myFunc.message = 'Hi John';

console.log(myFunc());
// 'Hi John'
```

```js
function myFunc() {
  myFunc.message = 'Hi John';
  console.log(myFunc.message);
}
console.log(myFunc());
// 'Hi John'
```

```js
function myFunc(param1, param2) {
  console.log(myFunc.length);
}
console.log(myFunc());
console.log(myFunc('a', 'b'));
console.log(myFunc('a', 'b', 'c', 'd'));
// 2 2 2
```

```js
function myFunc() {
  console.log(arguments.length);
}
console.log(myFunc());
console.log(myFunc('a', 'b'));
console.log(myFunc('a', 'b', 'c', 'd'));
// 0 2 4
```

```js
function Person(name, age) {
  this.name = name || 'John';
  this.age = age || 24;
  this.displayName = function() {
    console.log(this.name);
  };
}

Person.name = 'John';
Person.displayName = function() {
  console.log(this.name);
};

var person1 = new Person('John');
person1.displayName();
Person.displayName();

// John Person
```

### Scopes

```js
function passWordMngr() {
  var password = '12345678';
  this.userName = 'John';
  return {
    pwd: password,
  };
}
// Block End
var userInfo = passWordMngr();
console.log(userInfo.pwd);
console.log(userInfo.userName);
// 12345678 undefined
```

```js
var employeeId = 'aq123';
function Employee() {
  this.employeeId = 'bq1uy';
}
console.log(Employee.employeeId);
// undefined
```

```js
var employeeId = 'aq123';

function Employee() {
  this.employeeId = 'bq1uy';
}
console.log(new Employee().employeeId);
Employee.prototype.employeeId = 'kj182';
Employee.prototype.JobId = '1BJKSJ';
console.log(new Employee().JobId);
console.log(new Employee().employeeId);
// bq1uy 1BJKSJ bq1uy
```

```js
var employeeId = 'aq123';
(function Employee() {
  try {
    throw 'foo123';
  } catch (employeeId) {
    console.log(employeeId);
  }
  console.log(employeeId);
})();
// foo123 aq123
```

```js
// Call, Apply, Bind
(function() {
  var greet = 'Hello World';
  var toGreet = [].filter.call(greet, function(element, index) {
    return index > 5;
  });
  console.log(toGreet);
})();
// [ 'W', 'o', 'r', 'l', 'd' ]
```

```js
var output = (function(x) {
  delete x;
  return x;
})(0);

console.log(output);
// 0
// delete 只能用于删除对象的属性
```

```js
var x = 1;
var output = (function() {
  delete x;
  return x;
})();

console.log(output);
// 1
```

```js
var x = { foo: 1 };
var output = (function() {
  delete x.foo;
  return x.foo;
})();

console.log(output);
// undefined
```

```js
var Employee = {
  company: 'xyz',
};
var emp1 = Object.create(Employee);
delete emp1.company;
console.log(emp1.company);
// xyz
// 会去拿原型链上的属性
```

```js
var strA = 'hi there';
var strB = strA;
strB = 'bye there!';
console.log(strA);
// hi there
```

```js
var objA = { prop1: 42 };
var objB = objA;
objB.prop1 = 90;
console.log(objA);
// {prop1: 90}
```

```js
var objA = { prop1: 42 };
var objB = objA;
objB = {};
console.log(objA);
// {prop1: 42}
```

```js
var arrA = [0, 1, 2, 3, 4, 5];
var arrB = arrA;
arrB[0] = 42;
console.log(arrA);
// [42,1,2,3,4,5]
```

```js
var arrA = [0, 1, 2, 3, 4, 5];
var arrB = arrA.slice();
arrB[0] = 42;
console.log(arrA);
// [0,1,2,3,4,5]
```

```js
var arrA = [{ prop1: 'value of array A!!' }, { someProp: 'also value of array A!' }, 3, 4, 5];
var arrB = arrA;
arrB[0].prop1 = 42;
console.log(arrA);
// [{prop1: 42}, {someProp: "also value of array A!"}, 3,4,5]
```

```js
var arrA = [{ prop1: 'value of array A!!' }, { someProp: 'also value of array A!' }, 3, 4, 5];
var arrB = arrA.slice();
arrB[0].prop1 = 42;
arrB[3] = 20;
console.log(arrA);

// [{prop1: 42}, {someProp: "also value of array A!"}, 3,4,5]
function slice(arr) {
  var result = [];
  for (i = 0; i < arr.length; i++) {
    result.push(arr[i]);
  }
  return result;
}
```

```js
var trees = ['xyz', 'xxxx', 'test', 'ryan', 'apple'];
delete trees[3];
console.log(trees.length);
// 5
```

```js
var bar = true;
console.log(bar + 0);
console.log(bar + 'xyz');
console.log(bar + true);
console.log(bar + false);
// 1, "truexyz", 2, 1
```

```js
var z = 1,
  y = (z = typeof y);
console.log(y);
// undefined
```

```js
// NFE (Named Function Expression)
var foo = function bar() {
  return 12;
};
typeof bar();
// Reference Error
```

```js
bar();
(function abc() {
  console.log('something');
})();
function bar() {
  console.log('bar got called');
}
// bar got called
// something
```

```js
var salary = '1000$';

(function() {
  console.log('Original salary was ' + salary);

  var salary = '5000$';

  console.log('My New Salary ' + salary);
})();
// undefined, 5000$
```

```js
function User(name) {
  this.name = name || 'JsGeeks';
}

var person = (new User('xyz')['location'] = 'USA');
console.log(person);
// USA
```

### 检测对象未定义的属性

```js
var person = {
  name: 'Nishant',
  age: 24,
};

if (typeof someProperty === 'undefined') {
  console.log('something is undefined here');
}
```

### 检查一个对象是否含有某一个键.

```js
var person = {
  name: 'Nishant',
  age: 24,
};

console.log('name' in person); // checking own property print true
console.log('salary' in person); // checking undefined property print false

console.log(person.hasOwnProperty('toString')); // print false
console.log(person.hasOwnProperty('name')); // print true
console.log(person.hasOwnProperty('salary')); // print false
```

### What is NaN, why do we need it, and when can it break the page?

```js
Math.sqrt(-5);
Math.log(-1);
parseFloat(
  'foo',
); /* this is common: you get JSON from the server, convert some strings from JSON to a number and end up with NaN in your UI. */

NaN !== NaN;
NaN < 2; // false
NaN > 2; // false
NaN === 2; // false
```

### Fix the bug using ES5 only

```js
var arr = [10, 32, 65, 2];
for (var i = 0; i < arr.length; i++) {
  setTimeout(function() {
    console.log('The index of this number is: ' + i);
  }, 3000);
}
```

For ES6, you can just replace `var i` with `let i`.

For ES5, you need to create a function scope like here:

```js
var arr = [10, 32, 65, 2];
for (var i = 0; i < arr.length; i++) {
  setTimeout(
    (function(j) {
      return function() {
        console.log('The index of this number is: ' + j);
      };
    })(i),
    3000,
  );
}
```

### 检查一个变量是否是数组?

**Method 1:**

```js
// 1
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}
// 2 Duck typing arrays
function isArray(value) {
  return typeof value.sort === 'function'
}
// 3
function(value){
   // ECMAScript 5 feature
	if(typeof Array.isArray === 'function'){
		return Array.isArray(value);
	}else{
	   return Object.prototype.toString.call(value) === '[object Array]';
	}
}
```

### Object.create 工作原理

### 如何防止在 JavaScript 中修改对象 ?.

ECMAScript 5 introduce several methods to prevent modification of object which lock down object to ensure that no one, accidentally or otherwise, change functionality of Object.

There are three levels of preventing modification:

**1: Prevent extensions :**

No new properties or methods can be added to the object, but one can change the existing properties and method.

For example:

```js
var employee = {
  name: 'Nishant',
};

// lock the object
Object.preventExtensions(employee);

// Now try to change the employee object property name
employee.name = 'John'; // work fine

//Now try to add some new property to the object
employee.age = 24; // fails silently unless it's inside the strict mode
```

**2: Seal :**

It is same as prevent extension, in addition to this also prevent existing properties and methods from being deleted.

To seal an object, we use **Object.seal()** method. you can check whether an object is sealed or not using **Object.isSealed();**

```js
var employee = {
  name: 'Nishant',
};

// Seal the object
Object.seal(employee);

console.log(Object.isExtensible(employee)); // false
console.log(Object.isSealed(employee)); // true

delete employee.name; // fails silently unless it's in strict mode

// Trying to add new property will give an error
employee.age = 30; // fails silently unless in strict mode
```

when an object is sealed, its existing properties and methods can't be removed. Sealed object are also non-extensible.

**3: Freeze :**

Same as seal, In addition to this prevent existing properties methods from being modified (All properties and methods are read only).

To freeze an object, use Object.freeze() method. We can also determine whether an object is frozen using Object.isFrozen();

```js
var employee = {
  name: 'Nishant',
};

//Freeze the object
Object.freeze(employee);

// Seal the object
Object.seal(employee);

console.log(Object.isExtensible(employee)); // false
console.log(Object.isSealed(employee)); // true
console.log(Object.isFrozen(employee)); // true

employee.name = 'xyz'; // fails silently unless in strict mode
employee.age = 30; // fails silently unless in strict mode
delete employee.name; // fails silently unless it's in strict mode
```

Frozen objects are considered both non-extensible and sealed.

**Recommended:**

If you are decided to prevent modification, sealed, freeze the object then use in strict mode so that you can catch the error.

For example:

```js
'use strict';

var employee = {
  name: 'Nishant',
};

//Freeze the object
Object.freeze(employee);

// Seal the object
Object.seal(employee);

console.log(Object.isExtensible(employee)); // false
console.log(Object.isSealed(employee)); // true
console.log(Object.isFrozen(employee)); // true

employee.name = 'xyz'; // fails silently unless in strict mode
employee.age = 30; // fails silently unless in strict mode
delete employee.name; // fails silently unless it's in strict mode
```

## 动态编写合并两个 JavaScript 对象的代码。

Let say you have two objects

```js
var person = {
  name: 'John',
  age: 24,
};

var address = {
  addressLine1: 'Some Location x',
  addressLine2: 'Some Location y',
  city: 'NewYork',
};
```

Write merge function which will take two object and add all the own property of second object into first object.

```js
merge(person, address);

/* Now person should have 5 properties
name , age , addressLine1 , addressLine2 , city */
```

**Method 1: Using ES6, Object.assign method**

```js
const merge = (toObj, fromObj) => Object.assign(toObj, fromObj);
```

**Method 2: Without using built-in function**

```js
function merge(toObj, fromObj) {
  // Make sure both of the parameter is an object
  if (typeof toObj === 'object' && typeof fromObj === 'object') {
    for (var pro in fromObj) {
      // Assign only own properties not inherited properties
      if (fromObj.hasOwnProperty(pro)) {
        // Assign property and value
        toObj[pro] = fromObj[pro];
      }
    }
  } else {
    throw 'Merge function can apply only on object';
  }
}
```

## Question 49. JavaScript 中的不可枚举属性是什么?如何创建一个不可枚举属性?

Object can have properties that don't show up when you iterate through object using for...in loop or using Object.keys() to get an array of property names. This properties is know as non-enumerable properties.

Let say we have following object

```js
var person = {
  name: 'John',
};
person.salary = '10000$';
person['country'] = 'USA';

console.log(Object.keys(person)); // ['name', 'salary', 'country']
```

As we know that person object properties `name`, `salary` ,`country` are enumerable hence it's shown up when we called Object.keys(person).

To create a non-enumerable property we have to use **Object.defineProperty()**. This is a special method for creating non-enumerable property in JavaScript.

```js
var person = {
  name: 'John',
};
person.salary = '10000$';
person['country'] = 'USA';

// Create non-enumerable property
Object.defineProperty(person, 'phoneNo', {
  value: '8888888888',
  enumerable: false,
});

Object.keys(person); // ['name', 'salary', 'country']
```

In the example above `phoneNo` property didn't show up because we made it non-enumerable by setting **enumerable:false**

Now let's try to change value of `phoneNo`

```js
person.phoneNo = '7777777777';
```

Changing non-enumerable property value will return error in `strict mode`. In non-strict mode it won't through any error but it won't change the value of phoneNo.

**Bonus**

**Object.defineProperty()** is also let you create read-only properties as we saw above, we are not able to modify phoneNo value of a person object.

### What is Function binding ?

```js
var clickHandler = {
  message: 'click event handler',
  handleClick: function(event) {
    console.log(this.message);
  },
};

var btn = document.getElementById('myBtn');
// Add click event to btn
btn.addEventListener('click', clickHandler.handleClick);
```

```js
var clickHandler = {
  message: 'click event handler',
  handleClick: function(event) {
    console.log(this.message);
  },
};

var btn = document.getElementById('myBtn');
// Add click event to btn and bind the clickHandler object
btn.addEventListener('click', clickHandler.handleClick.bind(clickHandler));
```

### name 的值是多少？

```js
function A(name) {
  this.name = name || 'Tom';
  this.msg = "use 'this.' set in function";
}

function B() {}
B.prototype = A;

var b = new B();

console.log(b.name);
console.log(b.msg);
// A
// undefined
```

### 分析

`b.name`返回 `A`，是因为`b`上面没有`name`属性，他就会沿着原型链向上查找，然而 `b.__proto__` 为`函数A`，每一个函数都有一个属性为 name，其值是函数的名字。

```js
function abc() {
  /* 这是一个名为'abc'的函数 */
}
abc.name; // -> 'abc'
```

`b.msg` 为什么是`undefined`哪？ 因为`b.__proto__` 是 `函数A`，那怎么修改才能拿到`msg`哪？

```js
B.prototype = new A();
```

修改后的输出：

```
Tom
VM731:12 use 'this.' set in function
```

### 以下代码执行结果分别是什么？

- 3 + "3"
- "23" > "3"
- var b = true && 2;
- "abc123".slice(2, -1)
- "abc123".substring(2, -1)

### 以下代码执行结果是什么？

- 1

  ```js
  var foo = 1,
    bar = 2,
    j,
    test;
  test = function(j) {
    j = 5;
    var bar = 5;
    foo = 5;
  };
  test(10);
  console.log(foo); //
  console.log(bar); //
  console.log(j); //
  ```

- 2

  ```js
  for (var i = 0; i < 10; i++) {
    window.setTimeout(function() {
      console.log(i); // 
    }, 100);
  }
  console.log(i); //
  ```

- 3

  ```js
  var length = 10;
  function fn() {
    alert(this.length);
  }
  var obj = {
    length: 5,
    method: function() {
      fn();
    },
  };
  obj.method(); //？
  ```

- 4

  ```js
  function Foo() {
    this.value = 42;
  }
  Foo.prototype = {
    method: function() {
      return true;
    },
  };
  function Bar() {
    var value = 1;
    return {
      method: function() {
        return value;
      },
    };
  }
  Foo.prototype = new Bar();
  console.log(Foo.prototype.constructor); //
  console.log(Foo.prototype instanceof Bar); //
  var test = new Foo();
  console.log(test instanceof Foo); //
  console.log(test instanceof Bar); //
  console.log(test.method()); //
  ```

- 5

  ```js
  if (!('sina' in window)) {
    var sina = 1;
  }
  console.log('sina:', sina); //
  ```

  > 考察： 声明的提升

- 6

  ```js
  var t1 = new Date().getTime();
  var timer1 = setTimeout(function() {
    clearTimeout(timer1);
    console.info('实际执行延迟时间：', new Date().getTime() - t1, 'ms'); //
  }, 500);
  ```

  > 需要查看`setTimeout`的运行机制。考察：异步运行机制。

- 7

  ```js
  function SINA() {
    return 1;
  }
  var SINA;
  console.log(typeof SINA); //
  ```

  > 考察： 重复声明

- 8

```js
var sinaNews = {
  name: 'sinNewsName',
  test: function() {
    console.log('this.name:', this.name, '//');
  },
};
setTimeout(sinaNews.test, 500); //
```

> 考察：回调函数丢失 this 绑定

### 下面这段代码的执行结果是什么？

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
```

> 继续问，怎么实现期望一共返回 1-5，5 个值，并且一秒返回一个值？

### 下面代码打印出什么？

```js
const a = 2;
console.log(a); // ?
a = 3; //?
```

### 下面代码分别输出什么？

```js
function foo() {
  'use strict';
  console.log(this.a);
}

function bar() {
  console.log(this.a);
}

var a = "this is a 'a'";

bar(); // ?
foo(); // ?
```

### 根据以下代码，写出结果

```js
// 第一组
alert(a);
a();
var a = 3;
function a() {
  alert(10);
}
alert(a);
a = 6;
a();

//------------分割线------------------
// 第二组
alert(a);
a();
var a = 3;
var a = function() {
  alert(10);
};
alert(a);
a = 6;
a();
```

### 下面写出答案

```js
a = 1;
b = 1;
a == b; // ?
name1 = { a: 1 };
name2 = { a: 1 };
name1 == name2; //?
```

### 写出下列代码的运行结果：

```js
var a = 1;
function main() {
  alert(a);
  var a = 2;
  alert(this.a);
}
main();
```

### 下面代码运行的结果是什么？

```js
let obj = {
  fun1: () => {
    console.log('111');
  },
  fun2: () => {
    this.fun1();
  },
};

obj.fun2();
```

### 下面代码会输出什么？

```js
let arr = [1, 2, 3, 4];
let it1 = arr[Symbol.iterator](); // 遍历器接口
let res = it1.next();
console.log(res);
```

---

下面部分考察的是 `setTimeout` 与 ``

### 下面的执行结果是什么？

```js
function 1() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('111')
    }
    resolve(true)
  })
}
function 2() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('222')
    }
    resolve(true)
  })
}

setTimeout(function() {
  console.log('333')
}, 0) // 这是是会执行的。考察的是异步执行，js的任务队列

.all([1(), 2()]).then(function() {
  console.log('All Done!')
})
```

### 下面代码输出什么？ ？

#### 题目 1

```js
.resolve(1)
  .then(x => x + 1)
  .then(x => {
    throw new Error('my error')
  })
  .catch(() => 1)
  .then(x => x + 1)
  .then(x => console.log(x))
  .catch(console.error)
```

#### 题目 2

```js
// Qunar.com
setTimeout(() => {
  console.log(1);
}, 0);

new (resolve => {
  console.log(2);
  resolve();
  console.log(3);
}).then(() => {
  console.log(4);
});

console.log(5);
```

#### 题目 3

```js
var p1 = new (function(resolve, reject) {
  setTimeout(() =>reject(new Error('p1 中failure')) , 3000);
})

var p2 = new (function(resolve, reject){
  setTimeout(() => resolve(p1), 1000);
});
var p3 = new (function(resolve, reject) {
  resolve(2);
});
var p4 = new (function(resolve, reject) {
  reject(new Error('error  in  p4'));
});

1. p3.then(re => console.log(re)); //?
2. p4.catch(error => console.log(error));//?

3. p2.then(null,re => console.log(re));//?
4. p2.catch(re => console.log(re));//?
```

#### 题目 4

```js
var p1 = .resolve(1)
var p2 = new (resolve => {
  setTimeout(() => resolve(2), 100)
})
var v3 = 3
var p4 = new ((resolve, reject) => {
  setTimeout(() => reject('oops'), 10)
})

var p5 = new (resolve => {
  setTimeout(() => resolve(5), 0)
})
var p1 = .resolve(1)
.race([v3, p1, p2, p4, p5]).then(val => console.log(val)) //?
.race([p1, v3, p2, p4, p5]).then(val => console.log(val)) // ?
.race([p1, p2, p4, p5]).then(val => console.log(val)) // ?
.race([p2, p4, p5]).then(val => console.log(val)) //?
```

### 写出下列代码的执行结果

1.

```js
var a = 1;
b = function(x) {
  x && a(--x);
};
alert(a); // ? 1
```

2.

```js
if (!('a' in window)) {
  var a = 2;
}
alert(a); // undefined
```

3.

```js
function a() {
  return 1;
}
var a;
alert(a); // 显示function a () {return 1;}
```

4.

```js
function a() {
  return 1;
}
var a = 1 && 2;
alert(a); // 2
```

5.

```js
function a() {
  alert(this); // 全局对象window
}
a.apply(null);
```

---

sougou.com

### 下面写出答案

```js
a = 1;
b = 1;
a == b; // true
name1 = { a: 1 };
name2 = { a: 1 };
name1 == name2; //false
```

### 下面的执行结果是什么？

```js
function 1() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('111')
    }
    resolve(true)
  })
}
function 2() {
  return new (function(resolve, reject) {
    for (let i = 0; i < 2; i++) {
      console.log('222')
    }
    resolve(true)
  })
}

setTimeout(function() {
  console.log('333')
}, 0) // 这是是会执行的。考察的是异步执行，js的任务队列

.all([1(), 2()]).then(function() {
  console.log('All Done!')
})
```

> 结果是：

```js
'111';
'111';
'222';
'222';
'All Done!';
'333';
```

### 下面代码运行的结果是什么？

```js
let obj = {
  fun1: () => {
    console.log('111');
  },
  fun2: () => {
    this.fun1();
  },
};

obj.fun2(); // 报错 this不是指向obj的，而是指向undefined ，箭头函数的this是指向外部作用域的
```

### 下面代码会输出什么？

```js
let arr = [1, 2, 3, 4];
let it1 = arr[Symbol.iterator](); // 遍历器接口
let res = it1.next();
console.log(res);
```

结果是：

```js
{
  done: false,
  value: 1
}
```

### 下面代码输出什么？ ？

### 题目 1

```js
.resolve(1)
  .then(x => x + 1)
  .then(x => {
    throw new Error('my error')
  })
  .catch(() => 1)
  .then(x => x + 1)
  .then(x => console.log(x))
  .catch(console.error)
```

结果是：

2

### 题目 2

```js
setTimeout(() => {
  console.log(1);
}, 0);

new (resolve => {
  console.log(2);
  resolve();
  console.log(3);
  4;
}).then(() => {
  console.log(4);
});

console.log(5);
```

结果是：
2 3 5 4 1

### 题目 3

```js
var p1 = new (function(resolve, reject) {
  setTimeout(() =>reject(new Error('p1 中failure')) , 3000);
})

var p2 = new (function(resolve, reject){
  setTimeout(() => resolve(p1), 1000);
});
var p3 = new (function(resolve, reject) {
  resolve(2);
});
var p4 = new (function(resolve, reject) {
  reject(new Error('error  in  p4'));
});

1. p3.then(re => console.log(re));
2. p4.catch(error => console.log(error));

3. p2.then(null,re => console.log(re));
4. p2.catch(re => console.log(re));
```

打印的顺序是：2， "error in p4 "这是立即打印出来的。

而 3S 后会打印出两个'p1 中 failure'。

如果 3 直接写成`p2.then(re => console.log(re));`是会报错，说没有捕捉到错误。

### 题目 4

```js
var p1 = .resolve(1)
var p2 = new (resolve => {
  setTimeout(() => resolve(2), 100)
})
var v3 = 3
var p4 = new ((resolve, reject) => {
  setTimeout(() => reject('oops'), 10)
})

var p5 = new (resolve => {
  setTimeout(() => resolve(5), 0)
})
var p1 = .resolve(1)
.race([v3, p1, p2, p4, p5]).then(val => console.log(val)) // 3
.race([p1, v3, p2, p4, p5]).then(val => console.log(val)) // 1
.race([p1, p2, p4, p5]).then(val => console.log(val)) // 1
.race([p2, p4, p5]).then(val => console.log(val)) //5

// 这些的打印顺序是什么？
.race([v3, p1, p2, p4, p5]).then(val => console.log(val))
.race([p1, v3, p2, p4, p5]).then(val => console.log(val))
.race([p1, p2, p4, p5]).then(val => console.log(val))
.race([p2, p4, p5]).then(val => console.log(val))

.resolve(6).then(re => console.log(re)) // 6
```

打印顺序是：6 3 1 1 5

### 写出下面的值？

```js
var a = {};
var b = {};
var c = {a: 1};
var d[a] = 1;
d[b] = 1;
d[c] // 1
```

原因：
**在对象中属性名永远都是字符串。**如果使用 string 以外的其他值作为属性名，那么它首先会被转化为一个字符串。

```js
var obj = {};
obj[true] = 'foo';
obj[3] = 'bar';

//等价于
obj['true'] = 'foo';
obj['3'] = 'bar';
obj['[object Object]'] = 'baz';
```

所有对象的`toString()`的值都是`"[object Object]"`

```js
obj.toString(); // "[object Object]"
```

备注：
`.a` - 属性访问值
`["a"]` - 键访问
二者是等价的。

一些 JS 题目的解答

在[这里](http://davidshariff.com/quiz/)看到一些测试题，我 HTML 和 CSS 比较一般，尝试把里面的 JS 题目都解答一下：

#1.
"1" + 2 + "3" + 4

- 10
- 1234
- 37

答案：1234，加法优先级等同，从左往右，数字与字符串相加，数字转换成字符串进行运算，结果等同于："12"+"3"+4 = "123"+4 = "1234"。

<!--more-->

#2.

    4 + 3 + 2 + "1"

- 10
- 4321
- 91

答案：91，优先级同上，从左往右，等同于：7+2+"1" = 9+"1" = "91"。

#3.
var foo = 1;
function bar() {
foo = 10;
return;
function foo() {}
}
bar();
alert(foo);

- 1
- 10
- Function
- undefined
- Error

答案：1，function 的定义会提前到当前作用域之前，所以等同于：

    var foo = 1;
    function bar() {
    	function foo() {}
    	foo = 10;
    	return;
    }
    bar();
    alert(foo);

所以，在 foo=10 的时候，foo 是有定义的，属于局部变量，影响不到外层的 foo。

#4.

    function bar() {
        return foo;
        foo = 10;
        function foo() {}
        var foo = 11;
    }
    alert(typeof bar());

- number
- function
- undefined
- Error

答案：function，与上题类似，等同于：

    function bar() {
        function foo() {}
        return foo;
        foo = 10;
        var foo = 11;
    }
    alert(typeof bar());

在 return 之后声明和赋值的 foo 都无效，所以返回了 function。

补充，这个解答有问题：

> @尤里卡 Eureka：JS 中 function 声明和 var 声明都会被提前，最终得到结果为 function，是因为*名称解析顺序-Name Resolution Order*(http://t.cn/8kcIRts导致的function声明优先级大于var声明，而不是由return语句退出导致最后的结果~

#5.

    var x = 3;

    var foo = {
        x: 2,
        baz: {
            x: 1,
            bar: function() {
                return this.x;
            }
        }
    }

    var go = foo.baz.bar;

    alert(go());
    alert(foo.baz.bar());

- 1,2
- 1,3
- 2,1
- 2,3
- 3,1
- 3,2

答案：3,1
this 指向执行时刻的作用域，go 的作用域是全局，所以相当于 window，取到的就是 window.x，也就是 var x=3;这里定义的 x。而 foo.baz.bar()里面，this 指向 foo.baz，所以取到的是这个上面的 x，也就是 1。

#6.

    var x = 4,
        obj = {
            x: 3,
            bar: function() {
                var x = 2;
                setTimeout(function() {
                    var x = 1;
                    alert(this.x);
                }, 1000);
            }
        };
    obj.bar();

- 1
- 2
- 3
- 4
- undefined

答案：4，不管有这个 setTimeout 还是把这个函数立即执行，它里面这个 function 都是孤立的，this 只能是全局的 window，即使不延时，改成立即执行结果同样是 4。

#7.

    x = 1;
    function bar() {
        this.x = 2;
        return x;
    }
    var foo = new bar();
    alert(foo.x);

- 1
- 2
- undefined

答案：2，这里主要问题是最外面 x 的定义，试试把 x=1 改成 x={}，结果会不同的。这是为什么呢？在把函数当作构造器使用的时候，如果手动返回了一个值，要看这个值是否简单类型，如果是，等同于不写返回，如果不是简单类型，得到的就是手动返回的值。如果，不手动写返回值，就会默认从原型创建一个对象用于返回。

#8.

    function foo(a) {
        alert(arguments.length);
    }
    foo(1, 2, 3);

- 1
- 2
- 3
- undefined

答案 3，arguments 取的是实参的个数，而 foo.length 取的是形参个数。

#9.

    var foo = function bar() {};
    alert(typeof bar);

- function
- object
- undefined

答案：undefined，这种情况下 bar 的名字从外部不可见，那是不是这个名字别人就没法知道了呢？不是，toString 就可以看到它，比如说 alert(foo)，可以看看能打出什么。

#10.

    var arr = [];
    arr[0]  = 'a';
    arr[1]  = 'b';
    arr.foo = 'c';
    alert(arr.length);

- 1
- 2
- 3
- undefined

答案：2，数组的原型是 Object，所以可以像其他类型一样附加属性，不影响其固有性质。

#11.

    function foo(a) {
        arguments[0] = 2;
        alert(a);
    }
    foo(1);

- 1
- 2
- undefined

答案：2，实参可以直接从 arguments 数组中修改。

#12.

    function foo(){}
    delete foo.length;
    alert(typeof foo.length);

- number
- undefined
- object
- Error

答案：number，foo.length 是无法删除的，它在 Function 原型上，重点它的 configurable 是 false。
