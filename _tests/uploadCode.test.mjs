import test from 'node:test'
import assert from 'assert'
import { uploadCode } from '../index.mjs'

test('zipCode will zip correctly', async (t) => {
    const getDirectories = t.mock.fn(() => {
        return ['blue', 'red']
    })

    const uploadFile = t.mock.fn()
    const mock = {
        filesystem: {
            getDirectories,
            getFile: () => 'file'
        },
        uploadFile
    }

    await uploadCode(
        {
            bucketName: 'myBucket',
            functionsLocation: '/.hidden/myFunctions',
            zipTarget: '/.hidden/myTarget',
            hiddenFolder: '.hidden'
        },
        mock
    )

    const blueUploadInput = uploadFile.mock.calls[0].arguments[0]
    assert.deepEqual(blueUploadInput, {
        file: 'file',
        bucket: 'myBucket',
        key: 'myTarget/blue.zip'
    })

    const redUploadInput = uploadFile.mock.calls[1].arguments[0]
    assert.deepEqual(redUploadInput, {
        file: 'file',
        bucket: 'myBucket',
        key: 'myTarget/red.zip'
    })
})
