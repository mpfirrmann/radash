import * as fs from 'fs'

const jsonData: {
  line: number
  text: string
  jsdoc: string
}[] = JSON.parse(fs.readFileSync('documented_elements.json', 'utf8'))

jsonData.sort((itemA, itemB) => itemB.line - itemA.line)

const textContent = fs.readFileSync('array.ts', 'utf8')
const textLines = textContent.split('\n')

for (const item of jsonData) {
  if (item.line === 345) {
    console.log()
  }
  if (item.line <= textLines.length) {
    let doc = item.jsdoc.replace('```typescript', '')
    if (doc.endsWith('```')) {
      doc = doc.substring(0, doc.length - 3)
    }
    doc = doc.trim()
    if (!doc.endsWith('*/')) {
      doc += '*/'
    }
    textLines.splice(item.line - 1, 0, doc)
  }
}

const modifiedText = textLines.join('\n')
fs.writeFileSync('array.documented.ts', modifiedText)

console.log('JSDoc comments injected successfully.')
