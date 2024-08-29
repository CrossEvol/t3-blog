import { saveData } from '@/app/api/actions/action'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    try {
        const payload = await saveData(await request.formData())

        return NextResponse.json({
            message: 'File uploaded successfully',
            payload,
        })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
