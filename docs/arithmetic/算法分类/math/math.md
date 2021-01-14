---
layout: CustomPages
title: 前端与数据结构-数学
date: 2020-09-04
aside: false
draft: true
---

## Bit Manipulation

##### Get Bit

This method shifts the relevant bit to the zeroth position.
Then we perform `AND` operation with one which has bit
pattern like `0001`. This clears all bits from the original
number except the relevant one. If the relevant bit is one,
the result is `1`, otherwise the result is `0`.

> See [getBit](getBit) for further details.

##### Set Bit

This method shifts `1` over by `bitPosition` bits, creating a
value that looks like `00100`. Then we perform `OR` operation
that sets specific bit into `1` but it does not affect on
other bits of the number.

> See [setBit](setBit) for further details.

##### Clear Bit

This method shifts `1` over by `bitPosition` bits, creating a
value that looks like `00100`. Than it inverts this mask to get
the number that looks like `11011`. Then `AND` operation is
being applied to both the number and the mask. That operation
unsets the bit.

> See [clearBit](clearBit) for further details.

##### Update Bit

This method is a combination of "Clear Bit" and "Set Bit" methods.

> See [updateBit](updateBit) for further details.

##### isEven

This method determines if the number provided is even.
It is based on the fact that odd numbers have their last
right bit to be set to 1.

```
Number: 5 = 0b0101
isEven: false

Number: 4 = 0b0100
isEven: true
```

> See [isEven](isEven) for further details.

##### isPositive

This method determines if the number is positive. It is based on the fact that all positive
numbers have their leftmost bit to be set to `0`. However, if the number provided is zero
or negative zero, it should still return `false`.

```
Number: 1 = 0b0001
isPositive: true

Number: -1 = -0b0001
isPositive: false
```

> See [isPositive](isPositive) for further details.

##### Multiply By Two

This method shifts original number by one bit to the left.
Thus all binary number components (powers of two) are being
multiplying by two and thus the number itself is being
multiplied by two.

```
Before the shift
Number: 0b0101 = 5
Powers of two: 0 + 2^2 + 0 + 2^0

After the shift
Number: 0b1010 = 10
Powers of two: 2^3 + 0 + 2^1 + 0
```

> See [multiplyByTwo](multiplyByTwo) for further details.

##### Divide By Two

This method shifts original number by one bit to the right.
Thus all binary number components (powers of two) are being
divided by two and thus the number itself is being
divided by two without remainder.

```
Before the shift
Number: 0b0101 = 5
Powers of two: 0 + 2^2 + 0 + 2^0

After the shift
Number: 0b0010 = 2
Powers of two: 0 + 0 + 2^1 + 0
```

> See [divideByTwo](divideByTwo) for further details.

##### Switch Sign

This method make positive numbers to be negative and backwards.
To do so it uses "Twos Complement" approach which does it by
inverting all of the bits of the number and adding 1 to it.

```
1101 -3
1110 -2
1111 -1
0000  0
0001  1
0010  2
0011  3
```

> See [switchSign](switchSign) for further details.

##### Multiply Two Signed Numbers

This method multiplies two signed integer numbers using bitwise operators.
This method is based on the following facts:

```
a * b can be written in the below formats:
  0                     if a is zero or b is zero or both a and b are zeroes
  2a * (b/2)            if b is even
  2a * (b - 1)/2 + a    if b is odd and positive
  2a * (b + 1)/2 - a    if b is odd and negative
```

The advantage of this approach is that in each recursive step one of the operands
reduces to half its original value. Hence, the run time complexity is `O(log(b))` where `b` is
the operand that reduces to half on each recursive step.

> See [multiply](multiply) for further details.

##### Multiply Two Unsigned Numbers

This method multiplies two integer numbers using bitwise operators.
This method is based on that "Every number can be denoted as the sum of powers of 2".

The main idea of bitwise multiplication is that every number may be split
to the sum of powers of two:

I.e.

```
19 = 2^4 + 2^1 + 2^0
```

Then multiplying number `x` by `19` is equivalent of:

```
x * 19 = x * 2^4 + x * 2^1 + x * 2^0
```

Now we need to remember that `x * 2^4` is equivalent of shifting `x` left
by `4` bits (`x << 4`).

> See [multiplyUnsigned](multiplyUnsigned) for further details.

##### Count Set Bits

This method counts the number of set bits in a number using bitwise operators.
The main idea is that we shift the number right by one bit at a time and check
the result of `&` operation that is `1` if bit is set and `0` otherwise.

```
Number: 5 = 0b0101
Count of set bits = 2
```

> See [countSetBits](countSetBits) for further details.

##### Count Bits to Flip One Number to Another

This methods outputs the number of bits required to convert one number to another.
This makes use of property that when numbers are `XOR`-ed the result will be number
of different bits.

```
5 = 0b0101
1 = 0b0001
Count of Bits to be Flipped: 1
```

> See [bitsDiff](bitsDiff) for further details.

##### Count Bits of a Number

To calculate the number of valuable bits we need to shift `1` one bit left each
time and see if shifted number is bigger than the input number.

```
5 = 0b0101
Count of valuable bits is: 3
When we shift 1 four times it will become bigger than 5.
```

> See [bitLength](bitLength) for further details.

##### Is Power of Two

This method checks if a number provided is power of two. It uses the following
property. Let's say that `powerNumber` is a number that has been formed as a power
of two (i.e. 2, 4, 8, 16 etc.). Then if we'll do `&` operation between `powerNumber`
and `powerNumber - 1` it will return `0` (in case if number is power of two).

```
Number: 4 = 0b0100
Number: 3 = (4 - 1) = 0b0011
4 & 3 = 0b0100 & 0b0011 = 0b0000 <-- Equal to zero, is power of two.

Number: 10 = 0b01010
Number: 9 = (10 - 1) = 0b01001
10 & 9 = 0b01010 & 0b01001 = 0b01000 <-- Not equal to zero, not a power of two.
```

> See [isPowerOfTwo](isPowerOfTwo) for further details.

##### Full Adder

This method adds up two integer numbers using bitwise operators.

It implements [full adder](<https://en.wikipedia.org/wiki/Adder_(electronics)>)
electronics circuit logic to sum two 32-bit integers in two's complement format.
It's using the boolean logic to cover all possible cases of adding two input bits:
with and without a "carry bit" from adding the previous less-significant stage.

Legend:

- `A`: Number `A`
- `B`: Number `B`
- `ai`: ith bit of number `A`
- `bi`: ith bit of number `B`
- `carryIn`: a bit carried in from the previous less-significant stage
- `carryOut`: a bit to carry to the next most-significant stage
- `bitSum`: The sum of `ai`, `bi`, and `carryIn`
- `resultBin`: The full result of adding current stage with all less-significant stages (in binary)
- `resultDec`: The full result of adding current stage with all less-significant stages (in decimal)

```
A = 3: 011
B = 6: 110
┌──────┬────┬────┬─────────┬──────────┬─────────┬───────────┬───────────┐
│  bit │ ai │ bi │ carryIn │ carryOut │  bitSum │ resultBin │ resultDec │
├──────┼────┼────┼─────────┼──────────┼─────────┼───────────┼───────────┤
│   0  │ 1  │ 0  │    0    │    0     │     1   │       1   │     1     │
│   1  │ 1  │ 1  │    0    │    1     │     0   │      01   │     1     │
│   2  │ 0  │ 1  │    1    │    1     │     0   │     001   │     1     │
│   3  │ 0  │ 0  │    1    │    0     │     1   │    1001   │     9     │
└──────┴────┴────┴─────────┴──────────┴─────────┴───────────┴───────────┘
```

> See [fullAdder](fullAdder) for further details.
> See [Full Adder on YouTube](https://www.youtube.com/watch?v=wvJc9CZcvBc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8).

### bits/bitLength

```js
/**
 * Return the number of bits used in the binary representation of the number.
 *
 * @param {number} number
 * @return {number}
 */
export default function bitLength(number) {
  let bitsCounter = 0;

  while (1 << bitsCounter <= number) {
    bitsCounter += 1;
  }

  return bitsCounter;
}
```

### bits/bitsDiff

```js
import countSetBits from './countSetBits';

/**
 * Counts the number of bits that need to be change in order
 * to convert numberA to numberB.
 *
 * @param {number} numberA
 * @param {number} numberB
 * @return {number}
 */
export default function bitsDiff(numberA, numberB) {
  return countSetBits(numberA ^ numberB);
}
```

### bits/clearBit

```js
/**
 * @param {number} number
 * @param {number} bitPosition - zero based.
 * @return {number}
 */
export default function clearBit(number, bitPosition) {
  const mask = ~(1 << bitPosition);

  return number & mask;
}
```

### bits/countSetBits

```js
/**
 * @param {number} originalNumber
 * @return {number}
 */
export default function countSetBits(originalNumber) {
  let setBitsCount = 0;
  let number = originalNumber;

  while (number) {
    // Add last bit of the number to the sum of set bits.
    setBitsCount += number & 1;

    // Shift number right by one bit to investigate other bits.
    number >>= 1;
  }

  return setBitsCount;
}
```

### bits/divideByTwo

```js
/**
 * @param {number} number
 * @return {number}
 */
export default function divideByTwo(number) {
  return number >> 1;
}
```

### bits/fullAdder

```js
import getBit from './getBit';

/**
 * Add two numbers using only binary operators.
 *
 * This is an implementation of full adders logic circuit.
 * https://en.wikipedia.org/wiki/Adder_(electronics)
 * Inspired by: https://www.youtube.com/watch?v=wvJc9CZcvBc
 *
 * Table(1)
 *  INPUT  | OUT
 *  C Ai Bi | C Si | Row
 * -------- | -----| ---
 *  0  0  0 | 0  0 | 1
 *  0  0  1 | 0  1 | 2
 *  0  1  0 | 0  1 | 3
 *  0  1  1 | 1  0 | 4
 * -------- | ---- | --
 *  1  0  0 | 0  1 | 5
 *  1  0  1 | 1  0 | 6
 *  1  1  0 | 1  0 | 7
 *  1  1  1 | 1  1 | 8
 * ---------------------
 *
 * Legend:
 * INPUT C = Carry in, from the previous less-significant stage
 * INPUT Ai = ith bit of Number A
 * INPUT Bi = ith bit of Number B
 * OUT C = Carry out to the next most-significant stage
 * OUT Si = Bit Sum, ith least significant bit of the result
 *
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export default function fullAdder(a, b) {
  let result = 0;
  let carry = 0;

  // The operands of all bitwise operators are converted to signed
  // 32-bit integers in two's complement format.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
  for (let i = 0; i < 32; i += 1) {
    const ai = getBit(a, i);
    const bi = getBit(b, i);
    const carryIn = carry;

    // Calculate binary Ai + Bi without carry (half adder)
    // See Table(1) rows 1 - 4: Si = Ai ^ Bi
    const aiPlusBi = ai ^ bi;

    // Calculate ith bit of the result by adding the carry bit to Ai + Bi
    // For Table(1) rows 5 - 8 carryIn = 1: Si = Ai ^ Bi ^ 1, flip the bit
    // Fpr Table(1) rows 1 - 4 carryIn = 0: Si = Ai ^ Bi ^ 0, a no-op.
    const bitSum = aiPlusBi ^ carryIn;

    // Carry out one to the next most-significant stage
    // when at least one of these is true:
    // 1) Table(1) rows 6, 7: one of Ai OR Bi is 1 AND carryIn = 1
    // 2) Table(1) rows 4, 8: Both Ai AND Bi are 1
    const carryOut = (aiPlusBi & carryIn) | (ai & bi);
    carry = carryOut;

    // Set ith least significant bit of the result to bitSum.
    result |= bitSum << i;
  }

  return result;
}
```

### bits/getBit

```js
/**
 * @param {number} number
 * @param {number} bitPosition - zero based.
 * @return {number}
 */
export default function getBit(number, bitPosition) {
  return (number >> bitPosition) & 1;
}
```

### bits/isEven

```js
/**
 * @param {number} number
 * @return {boolean}
 */
export default function isEven(number) {
  return (number & 1) === 0;
}
```

### bits/isPositive

```js
/**
 * @param {number} number - 32-bit integer.
 * @return {boolean}
 */
export default function isPositive(number) {
  // Zero is neither a positive nor a negative number.
  if (number === 0) {
    return false;
  }

  // The most significant 32nd bit can be used to determine whether the number is positive.
  return ((number >> 31) & 1) === 0;
}
```

### bits/isPowerOfTwo

```js
/**
 * @param {number} number
 * @return bool
 */
export default function isPowerOfTwo(number) {
  return (number & (number - 1)) === 0;
}
```

### bits/multiply

```js
import multiplyByTwo from './multiplyByTwo';
import divideByTwo from './divideByTwo';
import isEven from './isEven';
import isPositive from './isPositive';

/**
 * Multiply two signed numbers using bitwise operations.
 *
 * If a is zero or b is zero or if both a and b are zeros:
 * multiply(a, b) = 0
 *
 * If b is even:
 * multiply(a, b) = multiply(2a, b/2)
 *
 * If b is odd and b is positive:
 * multiply(a, b) = multiply(2a, (b-1)/2) + a
 *
 * If b is odd and b is negative:
 * multiply(a, b) = multiply(2a, (b+1)/2) - a
 *
 * Time complexity: O(log b)
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export default function multiply(a, b) {
  // If a is zero or b is zero or if both a and b are zeros then the production is also zero.
  if (b === 0 || a === 0) {
    return 0;
  }

  // Otherwise we will have four different cases that are described above.
  const multiplyByOddPositive = () => multiply(multiplyByTwo(a), divideByTwo(b - 1)) + a;
  const multiplyByOddNegative = () => multiply(multiplyByTwo(a), divideByTwo(b + 1)) - a;

  const multiplyByEven = () => multiply(multiplyByTwo(a), divideByTwo(b));
  const multiplyByOdd = () => (isPositive(b) ? multiplyByOddPositive() : multiplyByOddNegative());

  return isEven(b) ? multiplyByEven() : multiplyByOdd();
}
```

### bits/multiplyByTwo

```js
/**
 * @param {number} number
 * @return {number}
 */
export default function multiplyByTwo(number) {
  return number << 1;
}
```

### bits/multiplyUnsigned

```js
/**
 * Multiply to unsigned numbers using bitwise operator.
 *
 * The main idea of bitwise multiplication is that every number may be split
 * to the sum of powers of two:
 *
 * I.e. 19 = 2^4 + 2^1 + 2^0
 *
 * Then multiplying number x by 19 is equivalent of:
 *
 * x * 19 = x * 2^4 + x * 2^1 + x * 2^0
 *
 * Now we need to remember that (x * 2^4) is equivalent of shifting x left by 4 bits (x << 4).
 *
 * @param {number} number1
 * @param {number} number2
 * @return {number}
 */
export default function multiplyUnsigned(number1, number2) {
  let result = 0;

  // Let's treat number2 as a multiplier for the number1.
  let multiplier = number2;

  // Multiplier current bit index.
  let bitIndex = 0;

  // Go through all bits of number2.
  while (multiplier !== 0) {
    // Check if current multiplier bit is set.
    if (multiplier & 1) {
      // In case if multiplier's bit at position bitIndex is set
      // it would mean that we need to multiply number1 by the power
      // of bit with index bitIndex and then add it to the result.
      result += number1 << bitIndex;
    }

    bitIndex += 1;
    multiplier >>= 1;
  }

  return result;
}
```

### bits/setBit

```js
/**
 * @param {number} number
 * @param {number} bitPosition - zero based.
 * @return {number}
 */
export default function setBit(number, bitPosition) {
  return number | (1 << bitPosition);
}
```

### bits/switchSign

```js
/**
 * Switch the sign of the number using "Twos Complement" approach.
 * @param {number} number
 * @return {number}
 */
export default function switchSign(number) {
  return ~number + 1;
}
```

### bits/updateBit

```js
/**
 * @param {number} number
 * @param {number} bitPosition - zero based.
 * @param {number} bitValue - 0 or 1.
 * @return {number}
 */
export default function updateBit(number, bitPosition, bitValue) {
  // Normalized bit value.
  const bitValueNormalized = bitValue ? 1 : 0;

  // Init clear mask.
  const clearMask = ~(1 << bitPosition);

  // Clear bit value and then set it up to required value.
  return (number & clearMask) | (bitValueNormalized << bitPosition);
}
```

### complex-number/ComplexNumber

```js
import radianToDegree from '../radian/radianToDegree';

export default class ComplexNumber {
  /**
   * z = re + im * i
   * z = radius * e^(i * phase)
   *
   * @param {number} [re]
   * @param {number} [im]
   */
  constructor({ re = 0, im = 0 } = {}) {
    this.re = re;
    this.im = im;
  }

  /**
   * @param {ComplexNumber|number} addend
   * @return {ComplexNumber}
   */
  add(addend) {
    // Make sure we're dealing with complex number.
    const complexAddend = this.toComplexNumber(addend);

    return new ComplexNumber({
      re: this.re + complexAddend.re,
      im: this.im + complexAddend.im,
    });
  }

  /**
   * @param {ComplexNumber|number} subtrahend
   * @return {ComplexNumber}
   */
  subtract(subtrahend) {
    // Make sure we're dealing with complex number.
    const complexSubtrahend = this.toComplexNumber(subtrahend);

    return new ComplexNumber({
      re: this.re - complexSubtrahend.re,
      im: this.im - complexSubtrahend.im,
    });
  }

  /**
   * @param {ComplexNumber|number} multiplicand
   * @return {ComplexNumber}
   */
  multiply(multiplicand) {
    // Make sure we're dealing with complex number.
    const complexMultiplicand = this.toComplexNumber(multiplicand);

    return new ComplexNumber({
      re: this.re * complexMultiplicand.re - this.im * complexMultiplicand.im,
      im: this.re * complexMultiplicand.im + this.im * complexMultiplicand.re,
    });
  }

  /**
   * @param {ComplexNumber|number} divider
   * @return {ComplexNumber}
   */
  divide(divider) {
    // Make sure we're dealing with complex number.
    const complexDivider = this.toComplexNumber(divider);

    // Get divider conjugate.
    const dividerConjugate = this.conjugate(complexDivider);

    // Multiply dividend by divider's conjugate.
    const finalDivident = this.multiply(dividerConjugate);

    // Calculating final divider using formula (a + bi)(a − bi) = a^2 + b^2
    const finalDivider = complexDivider.re ** 2 + complexDivider.im ** 2;

    return new ComplexNumber({
      re: finalDivident.re / finalDivider,
      im: finalDivident.im / finalDivider,
    });
  }

  /**
   * @param {ComplexNumber|number} number
   */
  conjugate(number) {
    // Make sure we're dealing with complex number.
    const complexNumber = this.toComplexNumber(number);

    return new ComplexNumber({
      re: complexNumber.re,
      im: -1 * complexNumber.im,
    });
  }

  /**
   * @return {number}
   */
  getRadius() {
    return Math.sqrt(this.re ** 2 + this.im ** 2);
  }

  /**
   * @param {boolean} [inRadians]
   * @return {number}
   */
  getPhase(inRadians = true) {
    let phase = Math.atan(Math.abs(this.im) / Math.abs(this.re));

    if (this.re < 0 && this.im > 0) {
      phase = Math.PI - phase;
    } else if (this.re < 0 && this.im < 0) {
      phase = -(Math.PI - phase);
    } else if (this.re > 0 && this.im < 0) {
      phase = -phase;
    } else if (this.re === 0 && this.im > 0) {
      phase = Math.PI / 2;
    } else if (this.re === 0 && this.im < 0) {
      phase = -Math.PI / 2;
    } else if (this.re < 0 && this.im === 0) {
      phase = Math.PI;
    } else if (this.re > 0 && this.im === 0) {
      phase = 0;
    } else if (this.re === 0 && this.im === 0) {
      // More correctly would be to set 'indeterminate'.
      // But just for simplicity reasons let's set zero.
      phase = 0;
    }

    if (!inRadians) {
      phase = radianToDegree(phase);
    }

    return phase;
  }

  /**
   * @param {boolean} [inRadians]
   * @return {{radius: number, phase: number}}
   */
  getPolarForm(inRadians = true) {
    return {
      radius: this.getRadius(),
      phase: this.getPhase(inRadians),
    };
  }

  /**
   * Convert real numbers to complex number.
   * In case if complex number is provided then lefts it as is.
   *
   * @param {ComplexNumber|number} number
   * @return {ComplexNumber}
   */
  toComplexNumber(number) {
    if (number instanceof ComplexNumber) {
      return number;
    }

    return new ComplexNumber({ re: number });
  }
}
```

## Complex Number

A **complex number** is a number that can be expressed in the
form `a + b * i`, where `a` and `b` are real numbers, and `i` is a solution of
the equation `x^2 = −1`. Because no _real number_ satisfies this
equation, `i` is called an _imaginary number_. For the complex
number `a + b * i`, `a` is called the _real part_, and `b` is called
the _imaginary part_.

![Complex Number](https://www.mathsisfun.com/numbers/images/complex-example.svg)

A Complex Number is a combination of a Real Number and an Imaginary Number:

![Complex Number](https://www.mathsisfun.com/numbers/images/complex-number.svg)

Geometrically, complex numbers extend the concept of the one-dimensional number
line to the _two-dimensional complex plane_ by using the horizontal axis for the
real part and the vertical axis for the imaginary part. The complex
number `a + b * i` can be identified with the point `(a, b)` in the complex plane.

A complex number whose real part is zero is said to be _purely imaginary_; the
points for these numbers lie on the vertical axis of the complex plane. A complex
number whose imaginary part is zero can be viewed as a _real number_; its point
lies on the horizontal axis of the complex plane.

| Complex Number | Real Part | Imaginary Part |                  |
| :------------- | :-------: | :------------: | ---------------- |
| 3 + 2i         |     3     |       2        |                  |
| 5              |     5     |     **0**      | Purely Real      |
| −6i            |   **0**   |       -6       | Purely Imaginary |

A complex number can be visually represented as a pair of numbers `(a, b)` forming
a vector on a diagram called an _Argand diagram_, representing the _complex plane_.
`Re` is the real axis, `Im` is the imaginary axis, and `i` satisfies `i^2 = −1`.

![Complex Number](https://upload.wikimedia.org/wikipedia/commons/a/af/Complex_number_illustration.svg)

> Complex does not mean complicated. It means the two types of numbers, real and
> imaginary, together form a complex, just like a building complex (buildings
> joined together).

### Polar Form

An alternative way of defining a point `P` in the complex plane, other than using
the x- and y-coordinates, is to use the distance of the point from `O`, the point
whose coordinates are `(0, 0)` (the origin), together with the angle subtended
between the positive real axis and the line segment `OP` in a counterclockwise
direction. This idea leads to the polar form of complex numbers.

![Polar Form](https://upload.wikimedia.org/wikipedia/commons/7/7a/Complex_number_illustration_modarg.svg)

The _absolute value_ (or modulus or magnitude) of a complex number `z = x + yi` is:

![Radius](https://wikimedia.org/api/rest_v1/media/math/render/svg/b59629c801aa0ddcdf17ee489e028fb9f8d4ea75)

The argument of `z` (in many applications referred to as the "phase") is the angle
of the radius `OP` with the positive real axis, and is written as `arg(z)`. As
with the modulus, the argument can be found from the rectangular form `x+yi`:

![Phase](https://wikimedia.org/api/rest_v1/media/math/render/svg/7cbbdd9bb1dd5df86dd2b820b20f82995023e566)

Together, `r` and `φ` give another way of representing complex numbers, the
polar form, as the combination of modulus and argument fully specify the
position of a point on the plane. Recovering the original rectangular
co-ordinates from the polar form is done by the formula called trigonometric
form:

![Polar Form](https://wikimedia.org/api/rest_v1/media/math/render/svg/b03de1e1b7b049880b5e4870b68a57bc180ff6ce)

Using Euler's formula this can be written as:

![Euler's Form](https://wikimedia.org/api/rest_v1/media/math/render/svg/0a087c772212e7375cb321d83fc1fcc715cd0ed2)

### Basic Operations

#### Adding

To add two complex numbers we add each part separately:

```
(a + b * i) + (c + d * i) = (a + c) + (b + d) * i
```

**Example**

```
(3 + 5i) + (4 − 3i) = (3 + 4) + (5 − 3)i = 7 + 2i
```

On complex plane the adding operation will look like the following:

![Complex Addition](https://www.mathsisfun.com/algebra/images/complex-plane-vector-add.svg)

#### Subtracting

To subtract two complex numbers we subtract each part separately:

```
(a + b * i) - (c + d * i) = (a - c) + (b - d) * i
```

**Example**

```
(3 + 5i) - (4 − 3i) = (3 - 4) + (5 + 3)i = -1 + 8i
```

#### Multiplying

To multiply complex numbers each part of the first complex number gets multiplied
by each part of the second complex number:

Just use "FOIL", which stands for "**F**irsts, **O**uters, **I**nners, **L**asts" (
see [Binomial Multiplication](ttps://www.mathsisfun.com/algebra/polynomials-multiplying.html) for
more details):

![Complex Multiplication](https://www.mathsisfun.com/algebra/images/foil-complex.svg)

- Firsts: `a × c`
- Outers: `a × di`
- Inners: `bi × c`
- Lasts: `bi × di`

In general it looks like this:

```
(a + bi)(c + di) = ac + adi + bci + bdi^2
```

But there is also a quicker way!

Use this rule:

```
(a + bi)(c + di) = (ac − bd) + (ad + bc)i
```

**Example**

```
(3 + 2i)(1 + 7i)
= 3×1 + 3×7i + 2i×1+ 2i×7i
= 3 + 21i + 2i + 14i^2
= 3 + 21i + 2i − 14   (because i^2 = −1)
= −11 + 23i
```

```
(3 + 2i)(1 + 7i) = (3×1 − 2×7) + (3×7 + 2×1)i = −11 + 23i
```

#### Conjugates

We will need to know about conjugates in a minute!

A conjugate is where we change the sign in the middle like this:

![Complex Conjugate](https://www.mathsisfun.com/numbers/images/complex-conjugate.svg)

A conjugate is often written with a bar over it:

```
______
5 − 3i   =   5 + 3i
```

On the complex plane the conjugate number will be mirrored against real axes.

![Complex Conjugate](https://upload.wikimedia.org/wikipedia/commons/6/69/Complex_conjugate_picture.svg)

#### Dividing

The conjugate is used to help complex division.

The trick is to _multiply both top and bottom by the conjugate of the bottom_.

**Example**

```
2 + 3i
------
4 − 5i
```

Multiply top and bottom by the conjugate of `4 − 5i`:

```
  (2 + 3i) * (4 + 5i)   8 + 10i + 12i + 15i^2
= ------------------- = ----------------------
  (4 − 5i) * (4 + 5i)   16 + 20i − 20i − 25i^2
```

Now remember that `i^2 = −1`, so:

```
  8 + 10i + 12i − 15    −7 + 22i   −7   22
= ------------------- = -------- = -- + -- * i
  16 + 20i − 20i + 25      41      41   41

```

There is a faster way though.

In the previous example, what happened on the bottom was interesting:

```
(4 − 5i)(4 + 5i) = 16 + 20i − 20i − 25i
```

The middle terms `(20i − 20i)` cancel out! Also `i^2 = −1` so we end up with this:

```
(4 − 5i)(4 + 5i) = 4^2 + 5^2
```

Which is really quite a simple result. The general rule is:

```
(a + bi)(a − bi) = a^2 + b^2
```

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Complex_number)
- [Math is Fun](https://www.mathsisfun.com/numbers/complex-numbers.html)

## Euclidean algorithm

In mathematics, the Euclidean algorithm, or Euclid's algorithm,
is an efficient method for computing the greatest common divisor
(GCD) of two numbers, the largest number that divides both of
them without leaving a remainder.

The Euclidean algorithm is based on the principle that the
greatest common divisor of two numbers does not change if
the larger number is replaced by its difference with the
smaller number. For example, `21` is the GCD of `252` and
`105` (as `252 = 21 × 12` and `105 = 21 × 5`), and the same
number `21` is also the GCD of `105` and `252 − 105 = 147`.
Since this replacement reduces the larger of the two numbers,
repeating this process gives successively smaller pairs of
numbers until the two numbers become equal.
When that occurs, they are the GCD of the original two numbers.

By reversing the steps, the GCD can be expressed as a sum of
the two original numbers each multiplied by a positive or
negative integer, e.g., `21 = 5 × 105 + (−2) × 252`.
The fact that the GCD can always be expressed in this way is
known as Bézout's identity.

![GCD](https://upload.wikimedia.org/wikipedia/commons/3/37/Euclid%27s_algorithm_Book_VII_Proposition_2_3.png)

Euclid's method for finding the greatest common divisor (GCD)
of two starting lengths `BA` and `DC`, both defined to be
multiples of a common "unit" length. The length `DC` being
shorter, it is used to "measure" `BA`, but only once because
remainder `EA` is less than `DC`. EA now measures (twice)
the shorter length `DC`, with remainder `FC` shorter than `EA`.
Then `FC` measures (three times) length `EA`. Because there is
no remainder, the process ends with `FC` being the `GCD`.
On the right Nicomachus' example with numbers `49` and `21`
resulting in their GCD of `7` (derived from Heath 1908:300).

![GCD](https://upload.wikimedia.org/wikipedia/commons/7/74/24x60.svg)

A `24-by-60` rectangle is covered with ten `12-by-12` square
tiles, where `12` is the GCD of `24` and `60`. More generally,
an `a-by-b` rectangle can be covered with square tiles of
side-length `c` only if `c` is a common divisor of `a` and `b`.

![GCD](https://upload.wikimedia.org/wikipedia/commons/1/1c/Euclidean_algorithm_1071_462.gif)

Subtraction-based animation of the Euclidean algorithm.
The initial rectangle has dimensions `a = 1071` and `b = 462`.
Squares of size `462×462` are placed within it leaving a
`462×147` rectangle. This rectangle is tiled with `147×147`
squares until a `21×147` rectangle is left, which in turn is
tiled with `21×21` squares, leaving no uncovered area.
The smallest square size, `21`, is the GCD of `1071` and `462`.

### References

[Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)

### euclidean-algorithm/euclideanAlgorithm

```js
/**
 * Recursive version of Euclidean Algorithm of finding greatest common divisor (GCD).
 * @param {number} originalA
 * @param {number} originalB
 * @return {number}
 */
export default function euclideanAlgorithm(originalA, originalB) {
  // Make input numbers positive.
  const a = Math.abs(originalA);
  const b = Math.abs(originalB);

  // To make algorithm work faster instead of subtracting one number from the other
  // we may use modulo operation.
  return b === 0 ? a : euclideanAlgorithm(b, a % b);
}
```

### euclidean-algorithm/euclideanAlgorithmIterative

```js
/**
 * Iterative version of Euclidean Algorithm of finding greatest common divisor (GCD).
 * @param {number} originalA
 * @param {number} originalB
 * @return {number}
 */
export default function euclideanAlgorithmIterative(originalA, originalB) {
  // Make input numbers positive.
  let a = Math.abs(originalA);
  let b = Math.abs(originalB);

  // Subtract one number from another until both numbers would become the same.
  // This will be out GCD. Also quit the loop if one of the numbers is zero.
  while (a && b && a !== b) {
    [a, b] = a > b ? [a - b, b] : [a, b - a];
  }

  // Return the number that is not equal to zero since the last subtraction (it will be a GCD).
  return a || b;
}
```

## Factorial

In mathematics, the factorial of a non-negative integer `n`,
denoted by `n!`, is the product of all positive integers less
than or equal to `n`. For example:

```
5! = 5 * 4 * 3 * 2 * 1 = 120
```

| n   |                n! |
| --- | ----------------: |
| 0   |                 1 |
| 1   |                 1 |
| 2   |                 2 |
| 3   |                 6 |
| 4   |                24 |
| 5   |               120 |
| 6   |               720 |
| 7   |             5 040 |
| 8   |            40 320 |
| 9   |           362 880 |
| 10  |         3 628 800 |
| 11  |        39 916 800 |
| 12  |       479 001 600 |
| 13  |     6 227 020 800 |
| 14  |    87 178 291 200 |
| 15  | 1 307 674 368 000 |

### References

[Wikipedia](https://en.wikipedia.org/wiki/Factorial)

### .zh-CN

## 阶乘

在数学上, 一个正整数 `n` 的阶乘 (写作 `n!`), 就是所有小于等于 `n` 的正整数的乘积. 比如:

```
5! = 5 * 4 * 3 * 2 * 1 = 120
```

| n   |                n! |
| --- | ----------------: |
| 0   |                 1 |
| 1   |                 1 |
| 2   |                 2 |
| 3   |                 6 |
| 4   |                24 |
| 5   |               120 |
| 6   |               720 |
| 7   |             5 040 |
| 8   |            40 320 |
| 9   |           362 880 |
| 10  |         3 628 800 |
| 11  |        39 916 800 |
| 12  |       479 001 600 |
| 13  |     6 227 020 800 |
| 14  |    87 178 291 200 |
| 15  | 1 307 674 368 000 |

### factorial/factorial

```js
/**
 * @param {number} number
 * @return {number}
 */
export default function factorial(number) {
  let result = 1;

  for (let i = 2; i <= number; i += 1) {
    result *= i;
  }

  return result;
}
```

### factorial/factorialRecursive

```js
/**
 * @param {number} number
 * @return {number}
 */
export default function factorialRecursive(number) {
  return number > 1 ? number * factorialRecursive(number - 1) : 1;
}
```

## Fast Powering Algorithm

**The power of a number** says how many times to use the number in a
multiplication.

It is written as a small number to the right and above the base number.

![Power](https://www.mathsisfun.com/algebra/images/exponent-8-2.svg)

### Naive Algorithm Complexity

How to find `a` raised to the power `b`?

We multiply `a` to itself, `b` times. That
is, `a^b = a * a * a * ... * a` (`b` occurrences of `a`).

This operation will take `O(n)` time since we need to do multiplication operation
exactly `n` times.

### Fast Power Algorithm

Can we do better than naive algorithm does? Yes we may solve the task of
powering in `O(log(n))` time.

The algorithm uses divide and conquer approach to compute power. Currently the
algorithm work for two positive integers `X` and `Y`.

The idea behind the algorithm is based on the fact that:

For **even** `Y`:

```
X^Y = X^(Y/2) * X^(Y/2)
```

For **odd** `Y`:

```
X^Y = X^(Y//2) * X^(Y//2) * X
where Y//2 is result of division of Y by 2 without reminder.
```

**For example**

```
2^4 = (2 * 2) * (2 * 2) = (2^2) * (2^2)
```

```
2^5 = (2 * 2) * (2 * 2) * 2 = (2^2) * (2^2) * (2)
```

Now, since on each step we need to compute the same `X^(Y/2)` power twice we may optimise
it by saving it to some intermediate variable to avoid its duplicate calculation.

**Time Complexity**

Since each iteration we split the power by half then we will call function
recursively `log(n)` times. This the time complexity of the algorithm is reduced to:

```
O(log(n))
```

### References

- [YouTube](https://www.youtube.com/watch?v=LUWavfN9zEo&index=80&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&t=0s)
- [Wikipedia](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)

### fast-powering/fastPowering

```js
/**
 * Fast Powering Algorithm.
 * Recursive implementation to compute power.
 *
 * Complexity: log(n)
 *
 * @param {number} base - Number that will be raised to the power.
 * @param {number} power - The power that number will be raised to.
 * @return {number}
 */
export default function fastPowering(base, power) {
  if (power === 0) {
    // Anything that is raised to the power of zero is 1.
    return 1;
  }

  if (power % 2 === 0) {
    // If the power is even...
    // we may recursively redefine the result via twice smaller powers:
    // x^8 = x^4 * x^4.
    const multiplier = fastPowering(base, power / 2);
    return multiplier * multiplier;
  }

  // If the power is odd...
  // we may recursively redefine the result via twice smaller powers:
  // x^9 = x^4 * x^4 * x.
  const multiplier = fastPowering(base, Math.floor(power / 2));
  return multiplier * multiplier * base;
}
```

## Fourier Transform

### Definitions

The **Fourier Transform** (**FT**) decomposes a function of time (a signal) into
the frequencies that make it up, in a way similar to how a musical chord can be
expressed as the frequencies (or pitches) of its constituent notes.

The **Discrete Fourier Transform** (**DFT**) converts a finite sequence of
equally-spaced samples of a function into a same-length sequence of
equally-spaced samples of the discrete-time Fourier transform (DTFT), which is a
complex-valued function of frequency. The interval at which the DTFT is sampled
is the reciprocal of the duration of the input sequence. An inverse DFT is a
Fourier series, using the DTFT samples as coefficients of complex sinusoids at
the corresponding DTFT frequencies. It has the same sample-values as the original
input sequence. The DFT is therefore said to be a frequency domain representation
of the original input sequence. If the original sequence spans all the non-zero
values of a function, its DTFT is continuous (and periodic), and the DFT provides
discrete samples of one cycle. If the original sequence is one cycle of a periodic
function, the DFT provides all the non-zero values of one DTFT cycle.

The Discrete Fourier transform transforms a sequence of `N` complex numbers:

{x<sub>n</sub>} = x<sub>0</sub>, x<sub>1</sub>, x<sub>2</sub> ..., x<sub>N-1</sub>

into another sequence of complex numbers:

{X<sub>k</sub>} = X<sub>0</sub>, X<sub>1</sub>, X<sub>2</sub> ..., X<sub>N-1</sub>

which is defined by:

![DFT](https://wikimedia.org/api/rest_v1/media/math/render/svg/1af0a78dc50bbf118ab6bd4c4dcc3c4ff8502223)

The **Discrete-Time Fourier Transform** (**DTFT**) is a form of Fourier analysis
that is applicable to the uniformly-spaced samples of a continuous function. The
term discrete-time refers to the fact that the transform operates on discrete data
(samples) whose interval often has units of time. From only the samples, it
produces a function of frequency that is a periodic summation of the continuous
Fourier transform of the original continuous function.

A **Fast Fourier Transform** (**FFT**) is an algorithm that samples a signal over
a period of time (or space) and divides it into its frequency components. These
components are single sinusoidal oscillations at distinct frequencies each with
their own amplitude and phase.

This transformation is illustrated in Diagram below. Over the time period measured
in the diagram, the signal contains 3 distinct dominant frequencies.

View of a signal in the time and frequency domain:

![FFT](https://upload.wikimedia.org/wikipedia/commons/6/61/FFT-Time-Frequency-View.png)

An FFT algorithm computes the discrete Fourier transform (DFT) of a sequence, or
its inverse (IFFT). Fourier analysis converts a signal from its original domain
to a representation in the frequency domain and vice versa. An FFT rapidly
computes such transformations by factorizing the DFT matrix into a product of
sparse (mostly zero) factors. As a result, it manages to reduce the complexity of
computing the DFT from O(n^2), which arises if one simply applies the
definition of DFT, to O(n log n), where n is the data size.

Here a discrete Fourier analysis of a sum of cosine waves at 10, 20, 30, 40,
and 50 Hz:

![FFT](https://upload.wikimedia.org/wikipedia/commons/6/64/FFT_of_Cosine_Summation_Function.png)

### Explanation

The Fourier Transform is one of deepest insights ever made. Unfortunately, the
meaning is buried within dense equations:

![](https://betterexplained.com/wp-content/plugins/wp-latexrender/pictures/45c088dbb767150fc0bacfeb49dd49e5.png)

and

![](https://betterexplained.com/wp-content/plugins/wp-latexrender/pictures/faeb9c5bf2e60add63ae4a70b293c7b4.png)

Rather than jumping into the symbols, let's experience the key idea firsthand. Here's a plain-English metaphor:

- _What does the Fourier Transform do?_ Given a smoothie, it finds the recipe.
- _How?_ Run the smoothie through filters to extract each ingredient.
- _Why?_ Recipes are easier to analyze, compare, and modify than the smoothie itself.
- _How do we get the smoothie back?_ Blend the ingredients.

**Think With Circles, Not Just Sinusoids**

The Fourier Transform is about circular paths (not 1-d sinusoids) and Euler's
formula is a clever way to generate one:

![](https://betterexplained.com/wp-content/uploads/euler/equal_paths.png)

Must we use imaginary exponents to move in a circle? Nope. But it's convenient
and compact. And sure, we can describe our path as coordinated motion in two
dimensions (real and imaginary), but don't forget the big picture: we're just
moving in a circle.

**Discovering The Full Transform**

The big insight: our signal is just a bunch of time spikes! If we merge the
recipes for each time spike, we should get the recipe for the full signal.

The Fourier Transform builds the recipe frequency-by-frequency:

![](https://betterexplained.com/wp-content/uploads/images/fourier-explained-20121219-224649.png)

A few notes:

- N = number of time samples we have
- n = current sample we're considering (0 ... N-1)
- x<sub>n</sub> = value of the signal at time n
- k = current frequency we're considering (0 Hertz up to N-1 Hertz)
- X<sub>k</sub> = amount of frequency k in the signal (amplitude and phase, a complex number)
- The 1/N factor is usually moved to the reverse transform (going from frequencies back to time). This is allowed, though I prefer 1/N in the forward transform since it gives the actual sizes for the time spikes. You can get wild and even use 1/sqrt(N) on both transforms (going forward and back creates the 1/N factor).
- n/N is the percent of the time we've gone through. 2 _ pi _ k is our speed in radians / sec. e^-ix is our backwards-moving circular path. The combination is how far we've moved, for this speed and time.
- The raw equations for the Fourier Transform just say "add the complex numbers". Many programming languages cannot handle complex numbers directly, so you convert everything to rectangular coordinates and add those.

Stuart Riffle has a great interpretation of the Fourier Transform:

![](https://betterexplained.com/wp-content/uploads/images/DerivedDFT.png)

### References

- [An Interactive Guide To The Fourier Transform](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/)
- [DFT on YouTube by Better Explained](https://www.youtube.com/watch?v=iN0VG9N2q0U&t=0s&index=77&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [FT on YouTube by 3Blue1Brown](https://www.youtube.com/watch?v=spUNpyF58BY&t=0s&index=76&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [FFT on YouTube by Simon Xu](https://www.youtube.com/watch?v=htCj9exbGo0&index=78&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&t=0s)
- Wikipedia
  - [FT](https://en.wikipedia.org/wiki/Fourier_transform)
  - [DFT](https://www.wikiwand.com/en/Discrete_Fourier_transform)
  - [DTFT](https://en.wikipedia.org/wiki/Discrete-time_Fourier_transform)
  - [FFT](https://www.wikiwand.com/en/Fast_Fourier_transform)

### fourier-transform/discreteFourierTransform

```js
import ComplexNumber from '../complex-number/ComplexNumber';

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

/**
 * Discrete Fourier Transform (DFT): time to frequencies.
 *
 * Time complexity: O(N^2)
 *
 * @param {number[]} inputAmplitudes - Input signal amplitudes over time (complex
 * numbers with real parts only).
 * @param {number} zeroThreshold - Threshold that is used to convert real and imaginary numbers
 * to zero in case if they are smaller then this.
 *
 * @return {ComplexNumber[]} - Array of complex number. Each of the number represents the frequency
 * or signal. All signals together will form input signal over discrete time periods. Each signal's
 * complex number has radius (amplitude) and phase (angle) in polar form that describes the signal.
 *
 * @see https://gist.github.com/anonymous/129d477ddb1c8025c9ac
 * @see https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
 */
export default function dft(inputAmplitudes, zeroThreshold = CLOSE_TO_ZERO_THRESHOLD) {
  const N = inputAmplitudes.length;
  const signals = [];

  // Go through every discrete frequency.
  for (let frequency = 0; frequency < N; frequency += 1) {
    // Compound signal at current frequency that will ultimately
    // take part in forming input amplitudes.
    let frequencySignal = new ComplexNumber();

    // Go through every discrete point in time.
    for (let timer = 0; timer < N; timer += 1) {
      const currentAmplitude = inputAmplitudes[timer];

      // Calculate rotation angle.
      const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

      // Remember that e^ix = cos(x) + i * sin(x);
      const dataPointContribution = new ComplexNumber({
        re: Math.cos(rotationAngle),
        im: Math.sin(rotationAngle),
      }).multiply(currentAmplitude);

      // Add this data point's contribution.
      frequencySignal = frequencySignal.add(dataPointContribution);
    }

    // Close to zero? You're zero.
    if (Math.abs(frequencySignal.re) < zeroThreshold) {
      frequencySignal.re = 0;
    }

    if (Math.abs(frequencySignal.im) < zeroThreshold) {
      frequencySignal.im = 0;
    }

    // Average contribution at this frequency.
    // The 1/N factor is usually moved to the reverse transform (going from frequencies
    // back to time). This is allowed, though it would be nice to have 1/N in the forward
    // transform since it gives the actual sizes for the time spikes.
    frequencySignal = frequencySignal.divide(N);

    // Add current frequency signal to the list of compound signals.
    signals[frequency] = frequencySignal;
  }

  return signals;
}
```

### fourier-transform/fastFourierTransform

```js
import ComplexNumber from '../complex-number/ComplexNumber';
import bitLength from '../bits/bitLength';

/**
 * Returns the number which is the flipped binary representation of input.
 *
 * @param {number} input
 * @param {number} bitsCount
 * @return {number}
 */
function reverseBits(input, bitsCount) {
  let reversedBits = 0;

  for (let bitIndex = 0; bitIndex < bitsCount; bitIndex += 1) {
    reversedBits *= 2;

    if (Math.floor(input / (1 << bitIndex)) % 2 === 1) {
      reversedBits += 1;
    }
  }

  return reversedBits;
}

/**
 * Returns the radix-2 fast fourier transform of the given array.
 * Optionally computes the radix-2 inverse fast fourier transform.
 *
 * @param {ComplexNumber[]} inputData
 * @param {boolean} [inverse]
 * @return {ComplexNumber[]}
 */
export default function fastFourierTransform(inputData, inverse = false) {
  const bitsCount = bitLength(inputData.length - 1);
  const N = 1 << bitsCount;

  while (inputData.length < N) {
    inputData.push(new ComplexNumber());
  }

  const output = [];
  for (let dataSampleIndex = 0; dataSampleIndex < N; dataSampleIndex += 1) {
    output[dataSampleIndex] = inputData[reverseBits(dataSampleIndex, bitsCount)];
  }

  for (let blockLength = 2; blockLength <= N; blockLength *= 2) {
    const imaginarySign = inverse ? -1 : 1;
    const phaseStep = new ComplexNumber({
      re: Math.cos((2 * Math.PI) / blockLength),
      im: imaginarySign * Math.sin((2 * Math.PI) / blockLength),
    });

    for (let blockStart = 0; blockStart < N; blockStart += blockLength) {
      let phase = new ComplexNumber({ re: 1, im: 0 });

      for (let signalId = blockStart; signalId < blockStart + blockLength / 2; signalId += 1) {
        const component = output[signalId + blockLength / 2].multiply(phase);

        const upd1 = output[signalId].add(component);
        const upd2 = output[signalId].subtract(component);

        output[signalId] = upd1;
        output[signalId + blockLength / 2] = upd2;

        phase = phase.multiply(phaseStep);
      }
    }
  }

  if (inverse) {
    for (let signalId = 0; signalId < N; signalId += 1) {
      output[signalId] /= N;
    }
  }

  return output;
}
```

### fourier-transform/inverseDiscreteFourierTransform

```js
import ComplexNumber from '../complex-number/ComplexNumber';

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

/**
 * Inverse Discrete Fourier Transform (IDFT): frequencies to time.
 *
 * Time complexity: O(N^2)
 *
 * @param {ComplexNumber[]} frequencies - Frequencies summands of the final signal.
 * @param {number} zeroThreshold - Threshold that is used to convert real and imaginary numbers
 * to zero in case if they are smaller then this.
 *
 * @return {number[]} - Discrete amplitudes distributed in time.
 */
export default function inverseDiscreteFourierTransform(frequencies, zeroThreshold = CLOSE_TO_ZERO_THRESHOLD) {
  const N = frequencies.length;
  const amplitudes = [];

  // Go through every discrete point of time.
  for (let timer = 0; timer < N; timer += 1) {
    // Compound amplitude at current time.
    let amplitude = new ComplexNumber();

    // Go through all discrete frequencies.
    for (let frequency = 0; frequency < N; frequency += 1) {
      const currentFrequency = frequencies[frequency];

      // Calculate rotation angle.
      const rotationAngle = 2 * Math.PI * frequency * (timer / N);

      // Remember that e^ix = cos(x) + i * sin(x);
      const frequencyContribution = new ComplexNumber({
        re: Math.cos(rotationAngle),
        im: Math.sin(rotationAngle),
      }).multiply(currentFrequency);

      amplitude = amplitude.add(frequencyContribution);
    }

    // Close to zero? You're zero.
    if (Math.abs(amplitude.re) < zeroThreshold) {
      amplitude.re = 0;
    }

    if (Math.abs(amplitude.im) < zeroThreshold) {
      amplitude.im = 0;
    }

    // Add current frequency signal to the list of compound signals.
    amplitudes[timer] = amplitude.re;
  }

  return amplitudes;
}
```

## Integer Partition

In number theory and combinatorics, a partition of a positive
integer `n`, also called an **integer partition**, is a way of
writing `n` as a sum of positive integers.

Two sums that differ only in the order of their summands are
considered the same partition. For example, `4` can be partitioned
in five distinct ways:

```
4
3 + 1
2 + 2
2 + 1 + 1
1 + 1 + 1 + 1
```

The order-dependent composition `1 + 3` is the same partition
as `3 + 1`, while the two distinct
compositions `1 + 2 + 1` and `1 + 1 + 2` represent the same
partition `2 + 1 + 1`.

Young diagrams associated to the partitions of the positive
integers `1` through `8`. They are arranged so that images
under the reflection about the main diagonal of the square
are conjugate partitions.

![Integer Partition](https://upload.wikimedia.org/wikipedia/commons/d/d8/Ferrer_partitioning_diagrams.svg)

### References

- [Wikipedia](<https://en.wikipedia.org/wiki/Partition_(number_theory)>)
- [YouTube](https://www.youtube.com/watch?v=ZaVM057DuzE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

### integer-partition/integerPartition

```js
/**
 * @param {number} number
 * @return {number}
 */
export default function integerPartition(number) {
  // Create partition matrix for solving this task using Dynamic Programming.
  const partitionMatrix = Array(number + 1)
    .fill(null)
    .map(() => {
      return Array(number + 1).fill(null);
    });

  // Fill partition matrix with initial values.

  // Let's fill the first row that represents how many ways we would have
  // to combine the numbers 1, 2, 3, ..., n with number 0. We would have zero
  // ways obviously since with zero number we may form only zero.
  for (let numberIndex = 1; numberIndex <= number; numberIndex += 1) {
    partitionMatrix[0][numberIndex] = 0;
  }

  // Let's fill the first column. It represents the number of ways we can form
  // number zero out of numbers 0, 0 and 1, 0 and 1 and 2, 0 and 1 and 2 and 3, ...
  // Obviously there is only one way we could form number 0
  // and it is with number 0 itself.
  for (let summandIndex = 0; summandIndex <= number; summandIndex += 1) {
    partitionMatrix[summandIndex][0] = 1;
  }

  // Now let's go through other possible options of how we could form number m out of
  // summands 0, 1, ..., m using Dynamic Programming approach.
  for (let summandIndex = 1; summandIndex <= number; summandIndex += 1) {
    for (let numberIndex = 1; numberIndex <= number; numberIndex += 1) {
      if (summandIndex > numberIndex) {
        // If summand number is bigger then current number itself then just it won't add
        // any new ways of forming the number. Thus we may just copy the number from row above.
        partitionMatrix[summandIndex][numberIndex] = partitionMatrix[summandIndex - 1][numberIndex];
      } else {
        /*
         * The number of combinations would equal to number of combinations of forming the same
         * number but WITHOUT current summand number PLUS number of combinations of forming the
         * <current number - current summand> number but WITH current summand.
         *
         * Example:
         * Number of ways to form 5 using summands {0, 1, 2} would equal the SUM of:
         * - number of ways to form 5 using summands {0, 1} (we've excluded summand 2)
         * - number of ways to form 3 (because 5 - 2 = 3) using summands {0, 1, 2}
         * (we've included summand 2)
         */
        const combosWithoutSummand = partitionMatrix[summandIndex - 1][numberIndex];
        const combosWithSummand = partitionMatrix[summandIndex][numberIndex - summandIndex];

        partitionMatrix[summandIndex][numberIndex] = combosWithoutSummand + combosWithSummand;
      }
    }
  }

  return partitionMatrix[number][number];
}
```

## Is a power of two

Given a positive integer, write a function to find if it is
a power of two or not.

**Naive solution**

In naive solution we just keep dividing the number by two
unless the number becomes `1` and every time we do so we
check that remainder after division is always `0`. Otherwise
the number can't be a power of two.

**Bitwise solution**

Powers of two in binary form always have just one bit.
The only exception is with a signed integer (e.g. an 8-bit
signed integer with a value of -128 looks like: `10000000`)

```
1: 0001
2: 0010
4: 0100
8: 1000
```

So after checking that the number is greater than zero,
we can use a bitwise hack to test that one and only one
bit is set.

```
number & (number - 1)
```

For example for number `8` that operations will look like:

```
  1000
- 0001
  ----
  0111

  1000
& 0111
  ----
  0000
```

### References

- [GeeksForGeeks](https://www.geeksforgeeks.org/program-to-find-whether-a-no-is-power-of-two/)
- [Bitwise Solution on Stanford](http://www.graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2)
- [Binary number subtraction on YouTube](https://www.youtube.com/watch?v=S9LJknZTyos&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=66)

### is-power-of-two/isPowerOfTwo

```js
/**
 * @param {number} number
 * @return {boolean}
 */
export default function isPowerOfTwo(number) {
  // 1 (2^0) is the smallest power of two.
  if (number < 1) {
    return false;
  }

  // Let's find out if we can divide the number by two
  // many times without remainder.
  let dividedNumber = number;
  while (dividedNumber !== 1) {
    if (dividedNumber % 2 !== 0) {
      // For every case when remainder isn't zero we can say that this number
      // couldn't be a result of power of two.
      return false;
    }

    dividedNumber /= 2;
  }

  return true;
}
```

### is-power-of-two/isPowerOfTwoBitwise

```js
/**
 * @param {number} number
 * @return {boolean}
 */
export default function isPowerOfTwoBitwise(number) {
  // 1 (2^0) is the smallest power of two.
  if (number < 1) {
    return false;
  }

  /*
   * Powers of two in binary look like this:
   * 1: 0001
   * 2: 0010
   * 4: 0100
   * 8: 1000
   *
   * Note that there is always exactly 1 bit set. The only exception is with a signed integer.
   * e.g. An 8-bit signed integer with a value of -128 looks like:
   * 10000000
   *
   * So after checking that the number is greater than zero, we can use a clever little bit
   * hack to test that one and only one bit is set.
   */
  return (number & (number - 1)) === 0;
}
```

## Least common multiple

In arithmetic and number theory, the least common multiple,
lowest common multiple, or smallest common multiple of
two integers `a` and `b`, usually denoted by `LCM(a, b)`, is
the smallest positive integer that is divisible by
both `a` and `b`. Since division of integers by zero is
undefined, this definition has meaning only if `a` and `b` are
both different from zero. However, some authors define `lcm(a,0)`
as `0` for all `a`, which is the result of taking the `lcm`
to be the least upper bound in the lattice of divisibility.

### Example

What is the LCM of 4 and 6?

Multiples of `4` are:

```
4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, ...
```

and the multiples of `6` are:

```
6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, ...
```

Common multiples of `4` and `6` are simply the numbers
that are in both lists:

```
12, 24, 36, 48, 60, 72, ....
```

So, from this list of the first few common multiples of
the numbers `4` and `6`, their least common multiple is `12`.

### Computing the least common multiple

The following formula reduces the problem of computing the
least common multiple to the problem of computing the greatest
common divisor (GCD), also known as the greatest common factor:

```
lcm(a, b) = |a * b| / gcd(a, b)
```

![LCM](https://upload.wikimedia.org/wikipedia/commons/c/c9/Symmetrical_5-set_Venn_diagram_LCM_2_3_4_5_7.svg)

A Venn diagram showing the least common multiples of
combinations of `2`, `3`, `4`, `5` and `7` (`6` is skipped as
it is `2 × 3`, both of which are already represented).

For example, a card game which requires its cards to be
divided equally among up to `5` players requires at least `60`
cards, the number at the intersection of the `2`, `3`, `4`
and `5` sets, but not the `7` set.

### References

[Wikipedia](https://en.wikipedia.org/wiki/Least_common_multiple)

### least-common-multiple/leastCommonMultiple

```js
import euclideanAlgorithm from '../euclidean-algorithm/euclideanAlgorithm';

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */

export default function leastCommonMultiple(a, b) {
  return a === 0 || b === 0 ? 0 : Math.abs(a * b) / euclideanAlgorithm(a, b);
}
```

## Liu Hui's π Algorithm

Liu Hui remarked in his commentary to The Nine Chapters on the Mathematical Art,
that the ratio of the circumference of an inscribed hexagon to the diameter of
the circle was `three`, hence `π` must be greater than three. He went on to provide
a detailed step-by-step description of an iterative algorithm to calculate `π` to
any required accuracy based on bisecting polygons; he calculated `π` to
between `3.141024` and `3.142708` with a 96-gon; he suggested that `3.14` was
a good enough approximation, and expressed `π` as `157/50`; he admitted that
this number was a bit small. Later he invented an ingenious quick method to
improve on it, and obtained `π ≈ 3.1416` with only a 96-gon, with an accuracy
comparable to that from a 1536-gon. His most important contribution in this
area was his simple iterative `π` algorithm.

### Area of a circle

Liu Hui argued:

> Multiply one side of a hexagon by the radius (of its
> circumcircle), then multiply this by three, to yield the
> area of a dodecagon; if we cut a hexagon into a
> dodecagon, multiply its side by its radius, then again
> multiply by six, we get the area of a 24-gon; the finer
> we cut, the smaller the loss with respect to the area
> of circle, thus with further cut after cut, the area of
> the resulting polygon will coincide and become one with
> the circle; there will be no loss

![Liu Hui](https://upload.wikimedia.org/wikipedia/commons/6/69/Cutcircle2.svg)

Liu Hui's method of calculating the area of a circle.

Further, Liu Hui proved that the area of a circle is half of its circumference
multiplied by its radius. He said:

> Between a polygon and a circle, there is excess radius. Multiply the excess
> radius by a side of the polygon. The resulting area exceeds the boundary of
> the circle

In the diagram `d = excess radius`. Multiplying `d` by one side results in
oblong `ABCD` which exceeds the boundary of the circle. If a side of the polygon
is small (i.e. there is a very large number of sides), then the excess radius
will be small, hence excess area will be small.

> Multiply the side of a polygon by its radius, and the area doubles;
> hence multiply half the circumference by the radius to yield the area of circle.

![Liu Hui](https://upload.wikimedia.org/wikipedia/commons/9/95/Cutcircle.svg)

The area within a circle is equal to the radius multiplied by half the
circumference, or `A = r x C/2 = r x r x π`.

### Iterative algorithm

Liu Hui began with an inscribed hexagon. Let `M` be the length of one side `AB` of
hexagon, `r` is the radius of circle.

![Liu Hui](https://upload.wikimedia.org/wikipedia/commons/4/46/Liuhui_geyuanshu.svg)

Bisect `AB` with line `OPC`, `AC` becomes one side of dodecagon (12-gon), let
its length be `m`. Let the length of `PC` be `j` and the length of `OP` be `G`.

`AOP`, `APC` are two right angle triangles. Liu Hui used
the [Gou Gu](https://en.wikipedia.org/wiki/Pythagorean_theorem) (Pythagorean theorem)
theorem repetitively:

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/dbfc192c78539c3901c7bad470302ededb76f813)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/ccd12a402367c2d6614c88e75006d50bfc3a9929)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/65d77869fc02c302d2d46d45f75ad7e79ae524fb)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/a7a0d0d7f505a0f434e5dd80c2fef6d2b30d6100)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/c31b9acf38f9d1a248d4023c3bf286bd03007f37)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/0dee798efb0b1e3e64d6b3542106cb3ecaa4a383)

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/3ffeafe88d2983b364ad3442746063e3207fe842)

From here, there is now a technique to determine `m` from `M`, which gives the
side length for a polygon with twice the number of edges. Starting with a
hexagon, Liu Hui could determine the side length of a dodecagon using this
formula. Then continue repetitively to determine the side length of a
24-gon given the side length of a dodecagon. He could do this recursively as
many times as necessary. Knowing how to determine the area of these polygons,
Liu Hui could then approximate `π`.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Liu_Hui%27s_%CF%80_algorithm)

### liu-hui/liuHui

```js
/*
 * Let circleRadius is the radius of circle.
 * circleRadius is also the side length of the inscribed hexagon
 */
const circleRadius = 1;

/**
 * @param {number} sideLength
 * @param {number} splitCounter
 * @return {number}
 */
function getNGonSideLength(sideLength, splitCounter) {
  if (splitCounter <= 0) {
    return sideLength;
  }

  const halfSide = sideLength / 2;

  // Liu Hui used the Gou Gu (Pythagorean theorem) theorem repetitively.
  const perpendicular = Math.sqrt(circleRadius ** 2 - halfSide ** 2);
  const excessRadius = circleRadius - perpendicular;
  const splitSideLength = Math.sqrt(excessRadius ** 2 + halfSide ** 2);

  return getNGonSideLength(splitSideLength, splitCounter - 1);
}

/**
 * @param {number} splitCount
 * @return {number}
 */
function getNGonSideCount(splitCount) {
  // Liu Hui began with an inscribed hexagon (6-gon).
  const hexagonSidesCount = 6;

  // On every split iteration we make N-gons: 6-gon, 12-gon, 24-gon, 48-gon and so on.
  return hexagonSidesCount * (splitCount ? 2 ** splitCount : 1);
}

/**
 * Calculate the π value using Liu Hui's π algorithm
 *
 * @param {number} splitCount - number of times we're going to split 6-gon.
 *  On each split we will receive 12-gon, 24-gon and so on.
 * @return {number}
 */
export default function liuHui(splitCount = 1) {
  const nGonSideLength = getNGonSideLength(circleRadius, splitCount - 1);
  const nGonSideCount = getNGonSideCount(splitCount - 1);
  const nGonPerimeter = nGonSideLength * nGonSideCount;
  const approximateCircleArea = (nGonPerimeter / 2) * circleRadius;

  // Return approximate value of pi.
  return approximateCircleArea / circleRadius ** 2;
}
```

## Pascal's Triangle

In mathematics, **Pascal's triangle** is a triangular array of
the [binomial coefficients](https://en.wikipedia.org/wiki/Binomial_coefficient).

The rows of Pascal's triangle are conventionally enumerated
starting with row `n = 0` at the top (the `0th` row). The
entries in each row are numbered from the left beginning
with `k = 0` and are usually staggered relative to the
numbers in the adjacent rows. The triangle may be constructed
in the following manner: In row `0` (the topmost row), there
is a unique nonzero entry `1`. Each entry of each subsequent
row is constructed by adding the number above and to the
left with the number above and to the right, treating blank
entries as `0`. For example, the initial number in the
first (or any other) row is `1` (the sum of `0` and `1`),
whereas the numbers `1` and `3` in the third row are added
to produce the number `4` in the fourth row.

![Pascal's Triangle](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)

### Formula

The entry in the `nth` row and `kth` column of Pascal's
triangle is denoted ![Formula](https://wikimedia.org/api/rest_v1/media/math/render/svg/206415d3742167e319b2e52c2ca7563b799abad7).
For example, the unique nonzero entry in the topmost
row is ![Formula example](https://wikimedia.org/api/rest_v1/media/math/render/svg/b7e35f86368d5978b46c07fd6dddca86bd6e635c).

With this notation, the construction of the previous
paragraph may be written as follows:

![Formula](https://wikimedia.org/api/rest_v1/media/math/render/svg/203b128a098e18cbb8cf36d004bd7282b28461bf)

for any non-negative integer `n` and any
integer `k` between `0` and `n`, inclusive.

![Binomial Coefficient](https://wikimedia.org/api/rest_v1/media/math/render/svg/a2457a7ef3c77831e34e06a1fe17a80b84a03181)

### Calculating triangle entries in O(n) time

We know that `i`-th entry in a line number `lineNumber` is
Binomial Coefficient `C(lineNumber, i)` and all lines start
with value `1`. The idea is to
calculate `C(lineNumber, i)` using `C(lineNumber, i-1)`. It
can be calculated in `O(1)` time using the following:

```
C(lineNumber, i)   = lineNumber! / ((lineNumber - i)! * i!)
C(lineNumber, i - 1) = lineNumber! / ((lineNumber - i + 1)! * (i - 1)!)
```

We can derive following expression from above two expressions:

```
C(lineNumber, i) = C(lineNumber, i - 1) * (lineNumber - i + 1) / i
```

So `C(lineNumber, i)` can be calculated
from `C(lineNumber, i - 1)` in `O(1)` time.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Pascal%27s_triangle)
- [GeeksForGeeks](https://www.geeksforgeeks.org/pascal-triangle/)

### pascal-triangle/pascalTriangle

```js
/**
 * @param {number} lineNumber - zero based.
 * @return {number[]}
 */
export default function pascalTriangle(lineNumber) {
  const currentLine = [1];

  const currentLineSize = lineNumber + 1;

  for (let numIndex = 1; numIndex < currentLineSize; numIndex += 1) {
    // See explanation of this formula in README.
    currentLine[numIndex] = (currentLine[numIndex - 1] * (lineNumber - numIndex + 1)) / numIndex;
  }

  return currentLine;
}
```

### pascal-triangle/pascalTriangleRecursive

```js
/**
 * @param {number} lineNumber - zero based.
 * @return {number[]}
 */
export default function pascalTriangleRecursive(lineNumber) {
  if (lineNumber === 0) {
    return [1];
  }

  const currentLineSize = lineNumber + 1;
  const previousLineSize = currentLineSize - 1;

  // Create container for current line values.
  const currentLine = [];

  // We'll calculate current line based on previous one.
  const previousLine = pascalTriangleRecursive(lineNumber - 1);

  // Let's go through all elements of current line except the first and
  // last one (since they were and will be filled with 1's) and calculate
  // current coefficient based on previous line.
  for (let numIndex = 0; numIndex < currentLineSize; numIndex += 1) {
    const leftCoefficient = numIndex - 1 >= 0 ? previousLine[numIndex - 1] : 0;
    const rightCoefficient = numIndex < previousLineSize ? previousLine[numIndex] : 0;

    currentLine[numIndex] = leftCoefficient + rightCoefficient;
  }

  return currentLine;
}
```

## Primality Test

A **prime number** (or a **prime**) is a natural number greater than `1` that
cannot be formed by multiplying two smaller natural numbers. A natural number
greater than `1` that is not prime is called a composite number. For
example, `5` is prime because the only ways of writing it as a
product, `1 × 5` or `5 × 1`, involve `5` itself. However, `6` is
composite because it is the product of two numbers `(2 × 3)` that are
both smaller than `6`.

![Prime Numbers](https://upload.wikimedia.org/wikipedia/commons/f/f0/Primes-vs-composites.svg)

A **primality test** is an algorithm for determining whether an input
number is prime. Among other fields of mathematics, it is used
for cryptography. Unlike integer factorization, primality tests
do not generally give prime factors, only stating whether the
input number is prime or not. Factorization is thought to be
a computationally difficult problem, whereas primality testing
is comparatively easy (its running time is polynomial in the
size of the input).

### References

- [Prime Numbers on Wikipedia](https://en.wikipedia.org/wiki/Prime_number)
- [Primality Test on Wikipedia](https://en.wikipedia.org/wiki/Primality_test)

### primality-test/trialDivision

```js
/**
 * @param {number} number
 * @return {boolean}
 */
export default function trialDivision(number) {
  // Check if number is integer.
  if (number % 1 !== 0) {
    return false;
  }

  if (number <= 1) {
    // If number is less than one then it isn't prime by definition.
    return false;
  }

  if (number <= 3) {
    // All numbers from 2 to 3 are prime.
    return true;
  }

  // If the number is not divided by 2 then we may eliminate all further even dividers.
  if (number % 2 === 0) {
    return false;
  }

  // If there is no dividers up to square root of n then there is no higher dividers as well.
  const dividerLimit = Math.sqrt(number);
  for (let divider = 3; divider <= dividerLimit; divider += 2) {
    if (number % divider === 0) {
      return false;
    }
  }

  return true;
}
```

## Radian

The **radian** (symbol **rad**) is the unit for measuring angles, and is the
standard unit of angular measure used in many areas of mathematics.

The length of an arc of a unit circle is numerically equal to the measurement
in radians of the angle that it subtends; one radian is just under `57.3` degrees.

An arc of a circle with the same length as the radius of that circle subtends an
angle of `1 radian`. The circumference subtends an angle of `2π radians`.

![Radian](https://upload.wikimedia.org/wikipedia/commons/4/4e/Circle_radians.gif)

A complete revolution is 2π radians (shown here with a circle of radius one and
thus circumference `2π`).

![2 pi Radian](https://upload.wikimedia.org/wikipedia/commons/6/67/2pi-unrolled.gif)

**Conversions**

| Radians | Degrees |
| :-----: | :-----: |
|    0    |   0°    |
|  π/12   |   15°   |
|   π/6   |   30°   |
|   π/4   |   45°   |
|    1    |  57.3°  |
|   π/3   |   60°   |
|   π/2   |   90°   |
|    π    |  180°   |
|   2π    |  360°   |

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Radian)

### radian/degreeToRadian

```js
/**
 * @param {number} degree
 * @return {number}
 */
export default function degreeToRadian(degree) {
  return degree * (Math.PI / 180);
}
```

### radian/radianToDegree

```js
/**
 * @param {number} radian
 * @return {number}
 */
export default function radianToDegree(radian) {
  return radian * (180 / Math.PI);
}
```

## Sieve of Eratosthenes

The Sieve of Eratosthenes is an algorithm for finding all prime numbers up to some limit `n`.

It is attributed to Eratosthenes of Cyrene, an ancient Greek mathematician.

### How it works

1. Create a boolean array of `n + 1` positions (to represent the numbers `0` through `n`)
2. Set positions `0` and `1` to `false`, and the rest to `true`
3. Start at position `p = 2` (the first prime number)
4. Mark as `false` all the multiples of `p` (that is, positions `2 * p`, `3 * p`, `4 * p`... until you reach the end of the array)
5. Find the first position greater than `p` that is `true` in the array. If there is no such position, stop. Otherwise, let `p` equal this new number (which is the next prime), and repeat from step 4

When the algorithm terminates, the numbers remaining `true` in the array are all
the primes below `n`.

An improvement of this algorithm is, in step 4, start marking multiples
of `p` from `p * p`, and not from `2 * p`. The reason why this works is because,
at that point, smaller multiples of `p` will have already been marked `false`.

### Example

![Sieve](https://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)

### Complexity

The algorithm has a complexity of `O(n log(log n))`.

### References

- [Wikipedia](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)

### sieve-of-eratosthenes/sieveOfEratosthenes

```js
/**
 * @param {number} maxNumber
 * @return {number[]}
 */
export default function sieveOfEratosthenes(maxNumber) {
  const isPrime = new Array(maxNumber + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  const primes = [];

  for (let number = 2; number <= maxNumber; number += 1) {
    if (isPrime[number] === true) {
      primes.push(number);

      /*
       * Optimisation.
       * Start marking multiples of `p` from `p * p`, and not from `2 * p`.
       * The reason why this works is because, at that point, smaller multiples
       * of `p` will have already been marked `false`.
       *
       * Warning: When working with really big numbers, the following line may cause overflow
       * In that case, it can be changed to:
       * let nextNumber = 2 * number;
       */
      let nextNumber = number * number;

      while (nextNumber <= maxNumber) {
        isPrime[nextNumber] = false;
        nextNumber += number;
      }
    }
  }

  return primes;
}
```

## Square Root (Newton's Method)

In numerical analysis, a branch of mathematics, there are several square root
algorithms or methods of computing the principal square root of a non-negative real
number. As, generally, the roots of a function cannot be computed exactly.
The root-finding algorithms provide approximations to roots expressed as floating
point numbers.

Finding ![](https://wikimedia.org/api/rest_v1/media/math/render/svg/bff86975b0e7944720b3e635c53c22c032a7a6f1) is
the same as solving the equation ![](https://wikimedia.org/api/rest_v1/media/math/render/svg/6cf57722151ef19ba1ca918d702b95c335e21cad) for a
positive `x`. Therefore, any general numerical root-finding algorithm can be used.

**Newton's method** (also known as the Newton–Raphson method), named after
_Isaac Newton_ and _Joseph Raphson_, is one example of a root-finding algorithm. It is a
method for finding successively better approximations to the roots of a real-valued function.

Let's start by explaining the general idea of Newton's method and then apply it to our particular
case with finding a square root of the number.

### Newton's Method General Idea

The Newton–Raphson method in one variable is implemented as follows:

The method starts with a function `f` defined over the real numbers `x`, the function's derivative `f'`, and an
initial guess `x0` for a root of the function `f`. If the function satisfies the assumptions made in the derivation
of the formula and the initial guess is close, then a better approximation `x1` is:

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/52c50eca0b7c4d64ef2fdca678665b73e944cb84)

Geometrically, `(x1, 0)` is the intersection of the `x`-axis and the tangent of
the graph of `f` at `(x0, f (x0))`.

The process is repeated as:

![](https://wikimedia.org/api/rest_v1/media/math/render/svg/710c11b9ec4568d1cfff49b7c7d41e0a7829a736)

until a sufficiently accurate value is reached.

![](https://upload.wikimedia.org/wikipedia/commons/e/e0/NewtonIteration_Ani.gif)

### Newton's Method of Finding a Square Root

As it was mentioned above, finding ![](https://wikimedia.org/api/rest_v1/media/math/render/svg/bff86975b0e7944720b3e635c53c22c032a7a6f1) is
the same as solving the equation ![](https://wikimedia.org/api/rest_v1/media/math/render/svg/6cf57722151ef19ba1ca918d702b95c335e21cad) for a
positive `x`.

The derivative of the function `f(x)` in case of square root problem is `2x`.

After applying the Newton's formula (see above) we get the following equation for our algorithm iterations:

```
x := x - (x² - S) / (2x)
```

The `x² − S` above is how far away `x²` is from where it needs to be, and the
division by `2x` is the derivative of `x²`, to scale how much we adjust `x` by how
quickly `x²` is changing.

### References

- [Methods of computing square roots on Wikipedia](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots)
- [Newton's method on Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)

### square-root/squareRoot

```js
/**
 * Calculates the square root of the number with given tolerance (precision)
 * by using Newton's method.
 *
 * @param number - the number we want to find a square root for.
 * @param [tolerance] - how many precise numbers after the floating point we want to get.
 * @return {number}
 */
export default function squareRoot(number, tolerance = 0) {
  // For now we won't support operations that involves manipulation with complex numbers.
  if (number < 0) {
    throw new Error('The method supports only positive integers');
  }

  // Handle edge case with finding the square root of zero.
  if (number === 0) {
    return 0;
  }

  // We will start approximation from value 1.
  let root = 1;

  // Delta is a desired distance between the number and the square of the root.
  // - if tolerance=0 then delta=1
  // - if tolerance=1 then delta=0.1
  // - if tolerance=2 then delta=0.01
  // - and so on...
  const requiredDelta = 1 / 10 ** tolerance;

  // Approximating the root value to the point when we get a desired precision.
  while (Math.abs(number - root ** 2) > requiredDelta) {
    // Newton's method reduces in this case to the so-called Babylonian method.
    // These methods generally yield approximate results, but can be made arbitrarily
    // precise by increasing the number of calculation steps.
    root -= (root ** 2 - number) / (2 * root);
  }

  // Cut off undesired floating digits and return the root value.
  return Math.round(root * 10 ** tolerance) / 10 ** tolerance;
}
```

# Math/CheckAddition

```js
/**
 * Given a list of numbers and specific integer, check if the sum
 * of any two integers in the list add to equal the given number.
 *
 * Formally, in the given set of arbitray integers, do an two
 * integers m,n in the set exist such that m + n = k, where k is a
 * given integer
 *
 * @flow
 */
export default function CheckAddition(target: number, list: number[]): boolean {
  const map = new Map();

  for (let i = 0; i < list.length; i++) {
    if (map.has(list[i])) {
      const curr = map.get(list[i]);
      map.set(list[i], curr + 1);
    } else {
      map.set(list[i], 1);
    }
  }

  for (let i = 0; i < list.length; i++) {
    const res = target - list[i];
    if (map.has(res)) {
      if (res === list[i]) {
        return map.get(res) > 1;
      }
      return true;
    }
  }

  return false;
}
```

# Math/Factorial

```js
/**
 * What is a factorial? I think an example is better than an explaination in
 * this case:
 *
 * Factorial(4, 1)
 * 4 * Factorial(3)
 * 4 * 3 * Factorial(2)
 * 4 * 3 * 2 * Factorial(1)
 * 4 * 3 * 2 * 1
 *
 * @complexity: O(n)
 *
 * @flow
 */
type num = number;

export default function FactorialRecursive(number: num, product: num = 1): num {
  switch (number) {
    case 1:
      return product;
    default:
      return FactorialRecursive(number - 1, product * number);
  }
}

export function FactorialIterative(number: num): num {
  let factorial = 1;
  let current = 1;

  while (current < number) {
    current++;
    factorial *= current;
  }

  return factorial;
}
```

# Math/HappyNumbers

```js
/**
 * Happy numbers
 *
 * Find the sum of the products of a digits of a number
 * Ex. 7 -> (7 * 7)
 * 7 -> 49 -> ...
 *
 * 36 -> (3 * 3) + (6 * 6)
 * 18 -> (1 * 1) + (8 * 8)
 *
 * 'Happy' numbers are numbers that will have a number whose pattern include
 * Ex. 7 -> 49 -> 97 -> 130 -> 10 -> 1
 *
 *
 * 'Unhappy' numbers will never include 1 in the sequence
 * Ex. 2 -> 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4
 *
 * Question: Determine if a number is 'happy' or not
 *
 * @flow
 */

/**
 * Calculate if a number is happy or unhappy
 */
export default function HappyNumbers(number: number): boolean {
  const numbers = new Set();
  let currentNumber = calc(number);
  let infiniteLoopPreventionLimit = 0;

  while (!numbers.has(1) && infiniteLoopPreventionLimit < 1000) {
    currentNumber = calc(currentNumber);

    if (numbers.has(currentNumber)) {
      return false;
    }

    numbers.add(currentNumber);
    infiniteLoopPreventionLimit++;

    if (currentNumber === 1) {
      return true;
    }
  }

  return false;
}

export function calc(number: number): number {
  const castedNumber = number.toString();

  let index;
  let sum = 0;

  for (index = 0; index < castedNumber.length; index++) {
    const int = parseInt(castedNumber[index], 10);
    const result = int * int;
    sum += result;
  }

  return sum;
}
```

# Math/Integral

```js
type num = number;

function integ(coefs: num[]): num[] {
  const newCoefs = coefs.map((coef: num, index: num): num => coef / (coefs.length - index));

  return [...newCoefs, 0];
}

function addExp(coefs: num[], x: num): num {
  return coefs
    .map((a: num, index: num): num => x ** (coefs.length - index - 1) * a)
    .reduce((c: num, p: num): num => c + p, 0);
}

export default function areaExact(coefs: num[], a: num, b: num): num {
  return addExp(integ(coefs), b) - addExp(integ(coefs), a);
}

export function areaNumerical(coefs: num[], delta: num = 1, a: num, b: num): num {
  let sum = 0;

  for (let i = a; i < b; i += delta) {
    const comp = addExp(coefs, i) * delta;
    sum += comp;
  }

  return sum;
}
```

# Math/Pascal

```js
// Pascal's Triangle
//
// Given numRows, generate the first numRows of Pascal's triangle.
//
// For example, given numRows = 5, return
// [
//       [1],
//      [1,1],
//     [1,2,1],
//    [1,3,3,1],
//   [1,4,6,4,1],
//  [1,5,10,10,5,1]
// ]
//

type num = number;
type pt = number[][];

export default function PascalRecursive(number: num, list: pt = []): pt {
  switch (list.length) {
    case 0:
      list.push([1]);
      return PascalRecursive(number, list);
    case 1:
      list.push([1, 1]);
      return PascalRecursive(number, list);
    case number:
      return list;
    default: {
      const _list = list[list.length - 1];
      const _tmp = [1];
      for (let i = 0; i < _list.length - 1; i++) {
        _tmp.push(_list[i] + _list[i + 1]);
      }
      _tmp.push(1);
      list.push(_tmp);
      return PascalRecursive(number, list);
    }
  }
}

export function PascalIterative(number: number): pt {
  if (number === 0) return [];
  const rows = [[1]];

  for (let i = 1; i < number; i++) {
    const some = [1];
    const length = rows[i - 1] ? rows[i - 1].length - 1 : 0;

    for (let j = 0; j < length; j++) {
      some.push(rows[i - 1][j] + (rows[i - 1][j + 1] || 0));
    }

    some.push(1);
    rows.push(some);
  }

  return rows;
}
```

# Math/PrimeNumberGenerator

```js
/**
 * Find all the prime numbers of a certain number. This solution is based on the
 * Sieve of Eratosthenes method
 *
 * For each int 'a' until the given limit, check if each following int 'b' is divisible
 * by 'a'
 *
 * @complexity: O(n(logn))
 * @flow
 */
export default function PrimeNumberGenerator(limit: number = 100): number[] {
  const primeNumbers = [];

  for (let i = 1; i <= limit; i++) {
    primeNumbers.push(i);
  }

  for (let i = 0; i < primeNumbers.length; i++) {
    for (let d = 0; d < primeNumbers.length; d++) {
      // Check if number is composite
      if (
        primeNumbers[d] !== primeNumbers[i] &&
        primeNumbers[i] !== 1 &&
        primeNumbers[d] !== 1 &&
        primeNumbers[d] % primeNumbers[i] === 0
      ) {
        // Perform in-place mutation for better memory efficiency
        primeNumbers.splice(d, 1);
      }
    }
  }

  return primeNumbers;
}
```

# Math/RandomNumber

```js
// Returning random numbers from Javascript
// Javascript's Math.random function only returns a random number from 0 to 1
// Here, we can write our own random functions to improve the random functionality

type num = number;

/**
 * Return a random number between a min and max
 */
export default function RandomBetween(min: num, max: num): num {
  return Math.random() * (max - min) + min;
}

// Assert randomBetween
export function isBeween(number: num, min: num, max: num): boolean {
  return number > min && number < max;
}
```

# Math/SquareRoot

```js
// Find the square root of a given number, without using the Math.sqrt function
//
// Hmm.. if I divide the number by two and round it, will it always be less
// than than the square root?
//
// In the case that the number is less than 4, this is not true
// ex. √16 < 8^2 (64)
// ex. √4 = 2^2
// ex. √3 > 1.5^2
// ex. √2 > 1^2
// ex. √1 > 0.5^2 (1)
// ex. √0.5 < 0.25^2 (0.625)
//
// So if half the number is greater than or equal to four, we know that the
// root is less than half of the number
//
// An efficient way of doing this is using a binary search tree.
//

type num = number;

/**
 * @complexity: O(log(n))
 */
export default function SquareRoot(number: num): num {
  let sqrt = 1;
  let head = 1;
  let tail = number;

  while (sqrt ** 2 !== number) {
    const middle = Math.floor((tail + head) / 2);
    sqrt = middle;

    if (sqrt ** 2 > number) {
      tail = middle;
    } else {
      head = middle;
    }
  }

  return sqrt;
}

// @TODO: Taylor Series Method
// @TODO: Newtonian Method Method
// @TODO: Babylonian Method Method
```

# Math/VectorCalculate

```js
/**
 * Calculate the resultant vector of a given series of component vectors
 * @flow
 */
type num = number;

type vector = {
  magnitude: num,
  direction: num,
};

type result = {
  xMag: num,
  yMag: num,
  totalMag: num,
};

export default function VectorCalculate(coords: vector[]): result {
  const x = coords.map((e: vector): num => e.magnitude * Math.cos(radsToDegrees(e.direction)));
  const y = coords.map((e: vector): num => e.magnitude * Math.sin(radsToDegrees(e.direction)));

  const xMag = sum(x);
  const yMag = sum(y);
  const totalMag = pythag(xMag, yMag);

  return { xMag, yMag, totalMag };
}

function pythag(x: num, y: num): num {
  return round(Math.sqrt(x ** 2 + y ** 2));
}

function sum(nums: num[]): num {
  return round(nums.reduce((p: num, c: num): num => p + c, 0));
}

function radsToDegrees(rad: num): num {
  return round((rad * Math.PI) / 180);
}

function round(number: num): num {
  return Math.round(number * 1000) / 1000;
}
```

### 实现 reduce

```js
function reduce(array, fn, value) {
  for (let i = 0; i < array.length; i++) {
    let current = array[i];
    value = fn(value, current, i, array);
  }
  return value;
}

/// tests

import { test } from 'ava';

test(t =>
  t.is(
    reduce([1, 2, 3, 4], (a, b) => a + b, 0),
    10,
  ),
);
```

### 实现异步 reduce

```js
let reduceAsync = async (array, fn, value) => {
  for (let a of array) {
    value = fn(value, await a());
  }
  return value;
};

/// tests

import { test } from 'ava';

test(async t => {
  let a = () => Promise.resolve('a');
  let b = () => Promise.resolve('b');
  let c = () => new Promise(resolve => setTimeout(() => resolve('c'), 100));

  t.deepEqual(await reduceAsync([a, b, c], (acc, value) => [...acc, value], []), ['a', 'b', 'c']);
  t.deepEqual(await reduceAsync([a, c, b], (acc, value) => [...acc, value], ['d']), ['d', 'a', 'c', 'b']);
});
```

### 实现 includes

```js
/**
 * We use a binary search to quickly search the given sorted array for the given number.
 */

function includes(array, number) {
  let index = binarySearch(array, number, 0, array.length - 1);
  return index !== undefined;
}

function binarySearch(array, number, leftIndex, rightIndex) {
  let midIndex = Math.floor((rightIndex + leftIndex) / 2);
  let current = array[midIndex];
  if (rightIndex < leftIndex) {
    return undefined;
  }
  if (number === current) {
    return midIndex;
  }
  if (number < current) {
    return binarySearch(array, number, leftIndex, midIndex - 1);
  }
  return binarySearch(array, number, midIndex + 1, rightIndex);
}

/// tests

import { test } from 'ava';

test(t => t.is(includes([1, 3, 8, 10], 8), true));
test(t => t.is(includes([1, 3, 8, 8, 15], 15), true));
test(t => t.is(includes([1, 3, 8, 10, 15], 9), false));
```

### 取交集

```js
function intersection(left, right) {
  // first build an object from the left array,
  // because checking if an object has a certain key
  // is cheap (it takes O(1) time).
  //
  // if we didn't use this object, we'd have to check
  // if result contains current on every turn of the
  // loop, which would take up to O(N * log(N)) time.
  let seen = left.reduce((seen, item) => {
    seen[item] = true;
    return seen;
  }, {});

  return right.reduce((result, current) => {
    if (current in seen) {
      return result.concat(current);
    }
    seen[current] = true;
    return result;
  }, []);
}

/// tests

import { test } from 'ava';

test(t => t.deepEqual(intersection([1, 5, 4, 2], [8, 91, 4, 1, 3]), [4, 1]));
test(t => t.deepEqual(intersection([1, 5, 4, 2], [7, 12]), []));
```



### 打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

81.打印出 1 - 10000 之间的所有对称数

例如：121、1331 等

```js
[...Array(10000).keys()].filter(x => {
  return (
    x.toString().length > 1 &&
    x ===
      Number(
        x
          .toString()
          .split('')
          .reverse()
          .join(''),
      )
  );
});
```

### 不用加减乘除运算符，求整数的 7 倍

```js
/* -- 位运算 -- */

// 先定义位运算加法
function bitAdd(m, n) {
  while (m) {
    [m, n] = [(m & n) << 1, m ^ n];
  }
  return n;
}

// 位运算实现方式 1 - 循环累加7次
let multiply7_bo_1 = num => {
  let sum = 0,
    counter = new Array(7); // 得到 [empty × 7]
  while (counter.length) {
    sum = bitAdd(sum, num);
    counter.shift();
  }
  return sum;
};

// 位运算实现方式 2 - 二进制进3位(乘以8)后，加自己的补码(乘以-1)
let multiply7_bo_2 = num => bitAdd(num << 3, -num);

/* -- JS hack -- */

// hack 方式 1 - 利用 Function 的构造器 & 乘号的字节码
let multiply7_hack_1 = num => new Function(['return ', num, String.fromCharCode(42), '7'].join(''))();

// hack 方式 2 - 利用 eval 执行器 & 乘号的字节码
let multiply7_hack_2 = num => eval([num, String.fromCharCode(42), '7'].join(''));

// hack 方式 3 - 利用 SetTimeout 的参数 & 乘号的字节码
setTimeout(['window.multiply7_hack_3=(num)=>(7', String.fromCharCode(42), 'num)'].join(''));

/* -- 进制转换 -- */

// 进制转换方式 - 利用 toString 转为七进制整数；然后末尾补0(左移一位)后通过 parseInt 转回十进制
let multiply7_base7 = num => parseInt([num.toString(7), '0'].join(''), 7);
```
