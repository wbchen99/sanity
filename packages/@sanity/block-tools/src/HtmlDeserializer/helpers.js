import {isEqual} from 'lodash'
import {BLOCK_DEFAULT_STYLE} from '../constants'
import resolveJsType from '../util/resolveJsType'
import preprocessors from './preprocessors'

/**
 * A utility function that always return a lowerCase version of the element.tagName
 *
 * @param {Object} DOMParser element
 * @return {String} Lowercase tagName for that element
 */

export function tagName(el) {
  if (!el || el.nodeType !== 1) {
    return undefined
  }
  return el.tagName.toLowerCase()
}

// TODO: make this plugin-style
export function preprocess(html, parseHtml, evaluate) {
  const compactHtml = html
    .trim() // Trim whitespace
    .replace(/\s\s+/g, ' ') // Remove multiple whitespace
    .replace(/[\r\n]/g, ' ') // Remove newlines / carriage returns
  const doc = parseHtml(compactHtml)
  preprocessors.forEach(processor => {
    processor(html, doc, evaluate)
  })
  return doc
}

/**
 * A default `parseHtml` function that returns the html using `DOMParser`.
 *
 * @param {String} html
 * @return {Object}
 */

export function defaultParseHtml() {
  if (resolveJsType(DOMParser) === 'undefined') {
    throw new Error(
      'The native `DOMParser` global which the `Html` deserializer uses by ' +
        'default is not present in this environment. ' +
        'You must supply the `options.parseHtml` function instead.'
    )
  }
  return html => {
    return new DOMParser().parseFromString(html, 'text/html')
  }
}

export function flattenNestedBlocks(blocks, blockContentFeatures) {
  const blockTypeName = blockContentFeatures.types.block.name
  let depth = 0
  const flattened = []
  const traverse = _nodes => {
    const toRemove = []
    _nodes.forEach((node, i) => {
      if (depth === 0) {
        flattened.push(node)
      }
      if (node._type === blockTypeName) {
        if (depth > 0) {
          toRemove.push(node)
          flattened.push(node)
        }
        depth++
        traverse(node.children)
      }
    })
    toRemove.forEach(node => {
      _nodes.splice(_nodes.indexOf(node), 1)
    })
    depth--
  }
  traverse(blocks)
  return flattened
}

function nextSpan(block, child, index) {
  const next = block.children[index + 1]
  return next && next._type === 'span' ? next : null
}
function prevSpan(block, child, index) {
  const prev = block.children[index - 1]
  return prev && prev._type === 'span' ? prev : null
}

function isWhiteSpaceChar(text) {
  return ['\xa0', ' '].includes(text)
}

export function trimWhitespace(blocks) {
  blocks.forEach(block => {
    if (!block.children) {
      return
    }
    // eslint-disable-next-line complexity
    block.children.forEach((child, index) => {
      if (child._type !== 'span') {
        return
      }
      const nextChild = nextSpan(block, child, index)
      const prevChild = prevSpan(block, child, index)
      if (index === 0) {
        child.text = child.text.replace(/^[^\S\n]+/g, '')
      }
      if (index === block.children.length - 1) {
        child.text = child.text.replace(/[^\S\n]+$/g, '')
      }
      if (
        /\s/.test(child.text.substring(child.text.length - 1)) &&
        nextChild &&
        /\s/.test(nextChild.text.substring(0, 1))
      ) {
        child.text = child.text.replace(/[^\S\n]+$/g, '')
      }
      if (
        /\s/.test(child.text.substring(0, 1)) &&
        prevChild &&
        /\s/.test(prevChild.text.substring(prevChild.text.length - 1))
      ) {
        child.text = child.text.replace(/^[^\S\n]+/g, '')
      }
      if (!child.text) {
        block.children.splice(index, 1)
      }
      if (prevChild && isEqual(prevChild.marks, child.marks) && isWhiteSpaceChar(child.text)) {
        prevChild.text += ' '
        block.children.splice(index, 1)
      } else if (
        nextChild &&
        isEqual(nextChild.marks, child.marks) &&
        isWhiteSpaceChar(child.text)
      ) {
        nextChild.text = ` ${nextChild.text}`
        block.children.splice(index, 1)
      }
    })
  })
  return blocks
}

export function ensureRootIsBlocks(blocks, blockContentFeatures) {
  const blockTypeName = blockContentFeatures.types.block.name
  return blocks.reduce((memo, node, i, original) => {
    if (node._type === blockTypeName) {
      memo.push(node)
      return memo
    }

    // __block is a symbol name, should not be blockTypeName!
    if (node._type === '__block') {
      memo.push(node.block)
      return memo
    }

    if (i > 0 && original[i - 1]._type !== blockTypeName) {
      const block = memo[memo.length - 1]
      block.children.push(node)
      return memo
    }

    const block = {
      _type: blockTypeName,
      markDefs: [],
      style: BLOCK_DEFAULT_STYLE,
      children: [node]
    }

    memo.push(block)
    return memo
  }, [])
}
