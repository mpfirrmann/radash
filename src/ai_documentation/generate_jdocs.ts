import * as fs from 'fs'
import { resolve } from 'path'
import { ExportedDeclarations, Project, SourceFile } from 'ts-morph'

type Declaration = {
  line: number
  code: string
  jsdoc?: string
}

function extractExportedElements(sourceFile: SourceFile): Declaration[] {
  const exportedDeclarations = sourceFile.getExportedDeclarations()
  const data: Declaration[] = []

  exportedDeclarations.forEach((symbol, _) => {
    symbol.forEach((declaration: ExportedDeclarations) => {
      data.push({
        line: declaration.getStartLineNumber(),
        code: declaration.getText()
      })
    })
  })

  return data
}

async function askTaia(
  element: Declaration,
  index?: number,
  total?: number
): Promise<Declaration> {
  const apiKey =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqbnIyZFQ1OTZXM2dUMzdFNF9CVUJsZnB2WlFSRFZFZTl3dXhqUVU0S0k0In0.eyJleHAiOjE3MzU4MjYzOTAsImlhdCI6MTcyODA1MDM5MCwianRpIjoiOGUzYzQ3YzYtODA0Zi00NDI4LTg5MjAtYTgxNGY4ZWY1Y2EzIiwiaXNzIjoiaHR0cHM6Ly9zc28udG5ndGVjaC5jb20vYXV0aC9yZWFsbXMvVE5HLUFJIiwiYXVkIjpbInRuZy1haS1wdWJsaWMtYWNjZXNzIiwiazhzLW9wZXJhdG9yLXByb2QiLCJhY2NvdW50Il0sInN1YiI6ImRhNWJmMWRiLTU3NWEtNDBlZC1hMDhmLTJlOWI4ZWFiZGJkZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InRuZy1haS1wdWJsaWMtYWNjZXNzIiwic2lkIjoiZWIxZGNhM2ItNzQ4ZS00Mjc2LWExMWMtYjBiNjE5ZWYwYzE4IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXRuZy1haSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJrOHMtb3BlcmF0b3ItcHJvZCI6eyJyb2xlcyI6WyJIMTAwX1NLQUlORVRfQUNDRVNTIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwibmFtZSI6IlNlYmFzdGlhbiBXdXR0a2UiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ3dXR0a2VzIiwiZ2l2ZW5fbmFtZSI6IlNlYmFzdGlhbiIsImZhbWlseV9uYW1lIjoiV3V0dGtlIiwiZW1haWwiOiJzZWJhc3RpYW4ud3V0dGtlQHRuZ3RlY2guY29tIn0.OyLKpIvB6ZogV6-Q7yx1wMwIVmELJz9V_Qglt5v1NXHKI7WxHaia4dzCwMNnUxVTjkSRdRfHeHdkiE8vlqd_-taM_1gcQ2Z5c6TvTuNMSOCyDR91PL98HbBFct7FNNiLfAi9_DL0vpfzbo2V_xPxSXXCmEstbKPHg0a2_nO_Yew0Y30Fl_eEKS729HlY3ehyhnZl4X5iD83HpxWMaH9GZCs--LH76SDM61pRobmrWXXUdheA980MBfYNzaiswPacsq6hqcIrCQAmGc3JOUFKKAMMxRv1Cx0dQDUOzkQ__6KciZvqYNU0momHcSxzB7uEe57O9BJxSiui2-EtvCbpDA'
  const endpoint = 'https://chat.model.tngtech.com/v1/chat/completions'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content:
              'i have a typescript library project and automatically generate documentation using typedoc. I will give you the code of one of my functions and you should answer me only with a docstring that i can paste above the function such that it can be ingested by typedoc.'
          },
          {
            role: 'user',
            content: `here is the code of the function: \n\n\`\`\`{element.code}\`\`\`\n\nthink twice and remember to not include anything else in your answer except the docstring because i want to use it in application to automatically paste the docstring into the code. Make really sure about this.`
          }
        ],
        temperature: 0.2
      })
    })

    if (!response.ok) {
      console.error(await response.text())
      throw new Error(`Error: ${response.statusText} ${response.status}`)
    }
    const data = await response.json()
    console.log(`received TAIA answer ${(index || 0) + 1}/${total}`)

    return { ...element, jsdoc: data.choices[0].message.content }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error)
    throw error
  }
}

function injectComments(
  absolutePath: string,
  documentedElements: Declaration[]
) {
  const textContent = fs.readFileSync(absolutePath, 'utf8')
  const textLines = textContent.split('\n')

  documentedElements.sort((itemA, itemB) => itemB.line - itemA.line)

  for (const element of documentedElements) {
    if (element.line <= textLines.length) {
      let doc = element.jsdoc?.replace('```typescript', '') || ''
      if (doc.endsWith('```')) {
        doc = doc.substring(0, doc.length - 3)
      }
      doc = doc.trim()
      if (!doc.endsWith('*/')) {
        doc += '*/'
      }
      textLines.splice(element.line - 1, 0, doc)
    }
  }

  const modifiedText = textLines.join('\n')
  fs.writeFileSync(absolutePath, modifiedText)
  console.log(`wrote file to \`${absolutePath}`)
}

async function processFile(filePath: string) {
  try {
    const absolutePath = resolve(filePath)
    const project = new Project()

    const sourceFile = project.addSourceFileAtPath(absolutePath)
    const elements = extractExportedElements(sourceFile)

    const documentedElements = await Promise.all(
      elements.map(async (element, index) =>
        askTaia(element, index, elements.length)
      )
    )

    injectComments(absolutePath, documentedElements)
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Please provide a path to a TypeScript file.')
  process.exit(1)
}

void processFile(filePath)
