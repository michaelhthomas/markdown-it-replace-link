/* eslint-env mocha */
const path = require('path')
const generate = require('markdown-it-testgen')
const expect = require('chai').expect
const fs = require('fs')
const fixtures = {
  env: fs.readFileSync(path.join(__dirname, 'fixtures/env.txt'), 'utf-8'),
  issue6: fs.readFileSync(path.join(__dirname, 'fixtures/issue6.txt'), 'utf-8'),
  tocPath: path.join(__dirname, 'fixtures/toc.txt')
}
const mdReplaceLink = require('../')

function replaceLink (link, env, token) {
  if (token.type === 'image') {
    return 'image/' + link
  }
  if (link === 'a') {
    return env.x + link
  }
  return 'http://me.com/' + link
}

describe('markdown-it-replace-link', function () {
  const md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true,
    replaceLink
  }).use(mdReplaceLink)
  generate(fixtures.tocPath, md)

  it('Passes on env', function (done) {
    const html = md.render(fixtures.env, {
      x: 'test/'
    })
    expect(html).to.equal('<p><a href="test/a">Hello</a></p>\n')
    done()
  })
})

describe('markdown-it-replace-link w. plugin options', function () {
  const md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(mdReplaceLink, {
    replaceLink
  })
  generate(fixtures.tocPath, md)

  it('Passes on env', function (done) {
    const html = md.render(fixtures.env, {
      x: 'test/'
    })
    expect(html).to.equal('<p><a href="test/a">Hello</a></p>\n')
    done()
  })
})

describe('markdown-it-replace-link issue6', function () {
  const md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  }).use(mdReplaceLink, {
    replaceLink
  })

  it('works with mixed html code as expected', function (done) {
    const html = md.render(fixtures.issue6, {
      x: 'test/'
    })
    expect(html).to.equal('<center>![](~/35)\n<center><img src="xxx">\n<p><img src="image/xxx" alt="altPath"></p>\n')
    done()
  })
})
