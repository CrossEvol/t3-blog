import { saveData } from '@/app/api/actions/action'
import type { IResult } from '@/common/result'
import { env } from '@/env'
import { getImageFromGithub, upload2Github } from '@/utils/github-upload'
import { type NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    if (!env.GITHUB_STORE_TOKEN || env.GITHUB_STORE_TOKEN.length <= 0) {
      const payload = await saveData(await request.formData())

      return NextResponse.json<IResult<string>>({
        status: 200,
        message: 'File uploaded successfully',
        data: payload,
      })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    const getRes = await getImageFromGithub(file)
    if (!!getRes) {
      return NextResponse.json<IResult<string>>({
        status: 200,
        message: 'File already exists',
        data: getRes,
      })
    }

    const res = await upload2Github(file)
    return NextResponse.json<IResult<string | undefined>>({
      status: 200,
      message: 'File uploaded successfully',
      data: res,
    })
  } catch (error) {
    console.error('Error uploading file:\n', error)
    return NextResponse.json<IResult<null>>({
      status: 500,
      message: 'Failed to upload file',
      data: null,
    })
  }
}
