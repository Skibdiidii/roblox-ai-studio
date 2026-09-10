#!/bin/bash
sed -i 's/const projectSummary = JSON.stringify({/const generatedXml = generateMinimalRbxlx(targetFiles);/g' server.ts
sed -i 's/name: targetProjectName,/\/\/ name: targetProjectName/g' server.ts
sed -i 's/exportedAt: new Date().toISOString(),/\/\/ exportedAt/g' server.ts
sed -i 's/fileCount: targetFiles ? Object.keys(targetFiles).length : 0/\/\/ fileCount/g' server.ts
sed -i 's/});/\/\/ });/g' server.ts
sed -i 's/body: Buffer.from(projectSummary, '"'"'utf-8'"'"')/body: Buffer.from(generatedXml, '"'"'utf-8'"'"')/g' server.ts
sed -i 's/Content-Type'"'"': '"'"'application\/octet-stream'"'"'/'"'"'Content-Type'"'"': '"'"'application\/xml'"'"'/g' server.ts
