import type {BrowserObject} from 'webdriverio'
import {createEvent, restore} from 'effector'
import {h, spec, using} from 'forest'

// let addGlobals: Function
declare const act: (cb?: () => any) => Promise<void>
declare const initBrowser: () => Promise<void>
declare const el: HTMLElement
// let execFun: <T>(cb: (() => Promise<T> | T) | string) => Promise<T>
// let readHTML: () => string
declare const browser: BrowserObject
declare const exec: (cb: () => any) => Promise<string[]>
declare const execFunc: <T>(cb: () => Promise<T>) => Promise<T>

beforeEach(async () => {
  await initBrowser()
}, 10e3)

it('supports setting static object class without class attr', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: {example: true, another: true},
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='example another'>content</div>
      "
    `)
})
it('supports setting static object class without class attr', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: ['example', 'another'],
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='example another'>content</div>
      "
    `)
})
it('supports setting static object class with class attr', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: {example: true, another: true},
        attr: {class: 'foreign'},
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='foreign example another'>content</div>
      "
    `)
})
it('supports setting static object class with class attr', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: ['example', 'another'],
        attr: {class: 'foreign'},
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='foreign example another'>content</div>
      "
    `)
})
it('supports setting dynamic object class', async () => {
  const [s1, s2] = await exec(async () => {
    const setClass = createEvent<boolean>()
    const $class = restore(setClass, false)
    using(el, () => {
      h('div', {
        text: 'content',
        classList: {example: $class},
        attr: {class: 'foreign'},
      })
    })
    await act()
    await act(() => {
      setClass(true)
    })
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='foreign'>content</div>
      "
    `)
  expect(s2).toMatchInlineSnapshot(`
      "
      <div class='foreign example'>content</div>
      "
    `)
})
it('supports setting dynamic array class', async () => {
  const [s1, s2] = await exec(async () => {
    const setClass = createEvent<string>()
    const $class = restore(setClass, null)
    using(el, () => {
      h('div', {
        text: 'content',
        classList: [$class],
        attr: {class: 'foreign'},
      })
    })
    await act()
    await act(() => {
      setClass('example')
    })
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='foreign'>content</div>
      "
    `)
  expect(s2).toMatchInlineSnapshot(`
      "
      <div class='foreign example'>content</div>
      "
    `)
})
it('supports setting dynamic object class without class property', async () => {
  const [s1, s2] = await exec(async () => {
    const setClass = createEvent<boolean>()
    const $class = restore(setClass, false)
    using(el, () => {
      h('div', {
        text: 'content',
        classList: {example: $class},
      })
    })
    await act()
    await act(() => {
      setClass(true)
    })
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div>content</div>
      "
    `)
  expect(s2).toMatchInlineSnapshot(`
      "
      <div class='example'>content</div>
      "
    `)
})
it('supports setting dynamic array class without class property', async () => {
  const [s1, s2] = await exec(async () => {
    const setClass = createEvent<string>()
    const $class = restore(setClass, null)
    using(el, () => {
      h('div', {
        text: 'content',
        classList: [$class],
      })
    })
    await act()
    await act(() => {
      setClass('example')
    })
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div>content</div>
      "
    `)
  expect(s2).toMatchInlineSnapshot(`
      "
      <div class='example'>content</div>
      "
    `)
})

it('supports merging static classList h with spec', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: ['first'],
        fn() {
          spec({classList: ['second']})
        },
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='second first'>content</div>
      "
    `)
})

it('supports merging static classList h with spec of different types', async () => {
  const [s1] = await exec(async () => {
    using(el, () => {
      h('div', {
        text: 'content',
        classList: ['first'],
        fn() {
          spec({classList: ['second']})
          spec({classList: {third: true}})
        },
      })
    })
    await act()
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div class='second third first'>content</div>
      "
    `)
})

it('supports merging dynamic spec classList', async () => {
  const [s1, s2, s3] = await exec(async () => {
    const setClassA = createEvent<string>()
    const $classA = restore(setClassA, null)
    const setClassB = createEvent<boolean>()
    const $classB = restore(setClassB, false)
    using(el, () => {
      h('div', {
        text: 'content',
        fn() {
          spec({classList: [$classA]})
          spec({classList: {third: $classB}})
        },
      })
    })
    await act()
    await act(() => {
      setClassA('demo')
    })
    await act(() => {
      setClassB(true)
    })
  })
  expect(s1).toMatchInlineSnapshot(`
      "
      <div>content</div>
      "
    `)
  expect(s2).toMatchInlineSnapshot(`
      "
      <div class='demo'>content</div>
      "
    `)
  expect(s3).toMatchInlineSnapshot(`
      "
      <div class='third demo'>content</div>
      "
    `)
})
