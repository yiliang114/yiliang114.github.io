---
layout: CustomPages
title: rabin-karp
date: 2020-11-21
aside: false
draft: true
---

## SF/ALGs/string/rabin-karp/README

# Rabin Karp Algorithm

In computer science, the Rabin–Karp algorithm or Karp–Rabin algorithm
is a string searching algorithm created by Richard M. Karp and
Michael O. Rabin (1987) that uses hashing to find any one of a set
of pattern strings in a text.

## Algorithm

The Rabin–Karp algorithm seeks to speed up the testing of equality of
the pattern to the substrings in the text by using a hash function. A
hash function is a function which converts every string into a numeric
value, called its hash value; for example, we might
have `hash('hello') = 5`. The algorithm exploits the fact
that if two strings are equal, their hash values are also equal. Thus,
string matching is reduced (almost) to computing the hash value of the
search pattern and then looking for substrings of the input string with
that hash value.

However, there are two problems with this approach. First, because there
are so many different strings and so few hash values, some differing
strings will have the same hash value. If the hash values match, the
pattern and the substring may not match; consequently, the potential
match of search pattern and the substring must be confirmed by comparing
them; that comparison can take a long time for long substrings.
Luckily, a good hash function on reasonable strings usually does not
have many collisions, so the expected search time will be acceptable.

## Hash Function Used

The key to the Rabin–Karp algorithm's performance is the efficient computation
of hash values of the successive substrings of the text.
The **Rabin fingerprint** is a popular and effective rolling hash function.

The **polynomial hash function** described in this example is not a Rabin
fingerprint, but it works equally well. It treats every substring as a
number in some base, the base being usually a large prime.

## Complexity

For text of length `n` and `p` patterns of combined length `m`, its average
and best case running time is `O(n + m)` in space `O(p)`, but its
worst-case time is `O(n * m)`.

## Application

A practical application of the algorithm is detecting plagiarism.
Given source material, the algorithm can rapidly search through a paper
for instances of sentences from the source material, ignoring details
such as case and punctuation. Because of the abundance of the sought
strings, single-string searching algorithms are impractical.

## SF/ALGs/string/rabin-karp/rabinKarp

```js
import PolynomialHash from '../../cryptography/polynomial-hash/PolynomialHash';

/**
 * @param {string} text - Text that may contain the searchable word.
 * @param {string} word - Word that is being searched in text.
 * @return {number} - Position of the word in text.
 */
export default function rabinKarp(text, word) {
  const hasher = new PolynomialHash();

  // Calculate word hash that we will use for comparison with other substring hashes.
  const wordHash = hasher.hash(word);

  let prevFrame = null;
  let currentFrameHash = null;

  // Go through all substring of the text that may match.
  for (let charIndex = 0; charIndex <= text.length - word.length; charIndex += 1) {
    const currentFrame = text.substring(charIndex, charIndex + word.length);

    // Calculate the hash of current substring.
    if (currentFrameHash === null) {
      currentFrameHash = hasher.hash(currentFrame);
    } else {
      currentFrameHash = hasher.roll(currentFrameHash, prevFrame, currentFrame);
    }

    prevFrame = currentFrame;

    // Compare the hash of current substring and seeking string.
    // In case if hashes match let's make sure that substrings are equal.
    // In case of hash collision the strings may not be equal.
    if (wordHash === currentFrameHash && text.substr(charIndex, word.length) === word) {
      return charIndex;
    }
  }

  return -1;
}
```
