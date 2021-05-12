#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import url from 'url'
import prompts from 'prompts'

// 再帰的にファイルをコピー
function copyFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.readdirSync(srcDir, { withFileTypes: true }).forEach((dirent) => {
    const srcFile = path.join(srcDir, dirent.name)
    const destFile = path.join(destDir, dirent.name)

    if (dirent.isDirectory()) {
      copyFiles(srcFile, destFile)
    } else if (!fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile)
    }
  })
}

async function main() {
  const answer = await prompts([
    {
      type: 'text',
      name: 'projectDir',
      message: 'Enter the directory where you want to create the project.',
      initial: './',
    },
  ])

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

  // テンプレートファイルをプロジェクトディレクトリにコピー
  copyFiles(path.join(__dirname, 'template'), path.resolve(answer.projectDir))
}

main()
