'use server'

import { env } from '@/env'
import fs from 'fs'
import { Buffer } from 'node:buffer'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export async function saveData(formData: FormData) {
  const file = formData.get('file') as File
  const fileBuffer = await file.arrayBuffer()
  const filePath = path.join(`./public/images/${file.name}`)
  await writeFile(filePath, Buffer.from(fileBuffer) as unknown as Uint8Array)

  return `${env.UPLOAD_ACTION_URL}/${path.join('images', file.name)}`
}
