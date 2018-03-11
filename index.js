'use strict'

const dict = require('./dict').dict
const reverse = require('./dict').reverse

module.exports = {
  dict,
  reverse,
  decode,
  encode,
  excludeFromDict
}

let customDict;

function excludeFromDict (charsToExclude) {
  customDict = dict;
  if (charsToExclude.length > 0) {
    charsToExclude.forEach(toExclude => {
      for (let pair of customDict) {
        const [ascii, fakeLetters] = pair;
        const index = fakeLetters.indexOf(toExclude);

        if (index !== -1) {
          fakeLetters.splice(index, 1);

          if (fakeLetters.length > 0) {
            // there are still some fake letters after removing this one
            customDict.set(ascii, fakeLetters)
          } else {
            // no other fake letters, we remove it from the Map
            customDict.delete(ascii)
          }

        }
      }
    })
  }
  // console.log('New dict', customDict)
}

function decode (text) {
  return replace(text, reverse, true, { chars: '' })
}

function encode (text, opts) {
  opts = Object.assign({
    probability: 33,
    chars: ''
  }, opts)

  return replace(text, customDict || dict, () => Math.random() < (opts.probability / 100), opts)
}

function splice (str, index, count, add) {
  return str.slice(0, index) + add + str.slice(index + count)
}

function replace (text, dict, condition, options) {
  const original = text
  let pos = 0

  for (let char of original) {
    const isInArray = (options.chars.length && options.chars.includes(char))
    if (isInArray || !options.chars.length) {
      const replacement = dict.get(char)

      if (replacement !== undefined) {
        const fakeLetter = Array.isArray(replacement) ? replacement[Math.floor(Math.random() * replacement.length)] : replacement

        if (typeof condition === 'function') {
          if (condition()) text = splice(text, pos, 1, fakeLetter)
        } else {
          text = splice(text, pos, 1, fakeLetter)
        }
      }
    }

    pos = pos + 1
  }
  return text
}
