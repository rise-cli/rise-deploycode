import test from 'node:test'
import assert from 'assert'
import { updateLambdaCode } from '../index.mjs'

test('updateLambdaCode will upload correctly', async (t) => {
    const getDirectories = t.mock.fn(() => {
        return ['blue', 'red']
    })

    const updateCode = t.mock.fn()
    const mock = {
        getDirectories,
        updateCode
    }

    await updateLambdaCode(
        {
            appName: 'my-app',
            stage: 'dev',
            region: 'us-east-1',
            bucket: 'my-bucket',
            zipConfig: {
                functionsLocation: '/.hidden/lambdas',
                zipTarget: '/.hidden/zips',
                hiddenFolder: '.hidden'
            }
        },
        mock
    )

    const blueUpdateInput = updateCode.mock.calls[0].arguments[0]

    assert.deepEqual(blueUpdateInput, {
        name: 'my-app-blue-dev',
        filePath: 'zips/blue.zip',
        bucket: 'my-bucket',
        region: 'us-east-1'
    })

    const redUpdateInput = updateCode.mock.calls[1].arguments[0]
    assert.deepEqual(redUpdateInput, {
        name: 'my-app-red-dev',
        filePath: 'zips/red.zip',
        bucket: 'my-bucket',
        region: 'us-east-1'
    })
})
