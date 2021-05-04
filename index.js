#!/usr/bin/env node

import fs from 'fs'
import os from 'os'
import path from 'path'
import url from 'url'
import prompts from 'prompts'

// 再帰的にファイルをコピー
function copyFiles(srcDir, destDir, overwrite = false) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.readdirSync(srcDir, { withFileTypes: true }).forEach((dirent) => {
    const srcFile = path.join(srcDir, dirent.name)
    const destFile = path.join(destDir, dirent.name)

    if (dirent.isDirectory()) {
      copyFiles(srcFile, destFile, overwrite)
    } else if (!fs.existsSync(destFile) || overwrite) {
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
    {
      type: 'select',
      name: 'config',
      message: 'Select additional configuration.',
      choices: [
        {
          title: 'None',
          value: null,
        },
        {
          title: 'Plugins',
          description: 'Add recommended plugins.',
          value: 'plugins',
        },
        {
          title: 'Headless',
          description: 'Add plugins for headless.',
          value: 'headless',
        },
      ],
      initial: 0,
    },
  ])

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const workingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-'))

  // 基本構成を作業用ディレクトリにコピー
  copyFiles(path.join(__dirname, 'template'), workingDir)

  // 追加構成を作業用ディレクトリにコピー (上書き)
  if (answer.config !== null) {
    copyFiles(
      path.join(__dirname, `template-${answer.config}`),
      workingDir,
      true
    )
  }

  // 作業用ディレクトリをプロジェクトディレクトリにコピー
  copyFiles(workingDir, path.resolve(answer.projectDir))

  // 作業用ディレクトリを削除
  // TODO: Node.jsの推奨版が v15 になったら fs.rmSync に移行
  // https://nodejs.org/api/fs.html#fs_fs_rmsync_path_options
  fs.rmdirSync(workingDir, { recursive: true })
}

main()
