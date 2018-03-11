import test from 'ava'
import homoglyph from './'

test('encode', t => {
  const text = 'text ;'
  const output = homoglyph.encode(text, { probability: 100, chars: ' ;' })
  t.not(output, text)
})

test('decode', t => {
  const text = 'text ;'
  const input = homoglyph.encode(text, { probability: 100 })
  const output = homoglyph.decode(input)
  t.same(output, text)
})

test('excludeFromDict', t => {
  const text = 'w'

  homoglyph.excludeFromDict(['\u{1D21}'])

  const output = homoglyph.encode(text, { probability: 100 })
  t.same(text, output)
})
