import {ExportedDeclarations, Project, SourceFile} from 'ts-morph';
import * as fs from 'fs';

const filePath = 'array.ts';

const project = new Project();

const sourceFile = project.addSourceFileAtPath(filePath);

function extractExportedElements(sourceFile: SourceFile) {
    const exportedDeclarations = sourceFile.getExportedDeclarations();
    const data: { line: number; text: string }[] = [];

    exportedDeclarations.forEach((symbol, _) => {
        symbol.forEach((declaration: ExportedDeclarations) => {
            const startLine = declaration.getStartLineNumber();
            const declarationText = declaration.getText();

            data.push({ line: startLine, text: declarationText });
        });
    });

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('exported_elements.json', jsonData);
}

extractExportedElements(sourceFile);
