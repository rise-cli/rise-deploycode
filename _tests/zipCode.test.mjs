import test from 'node:test'
import assert from 'assert'
import process from 'node:process'
import { zipCode } from '../index.mjs'

test('zipCode will zip correctly', async (t) => {
    const getDirectories = t.mock.fn(() => {
        return ['blue', 'red']
    })

    const zipFolder = t.mock.fn()
    const mockFs = {
        getDirectories,
        zipFolder
    }

    await zipCode(
        {
            functionsLocation: '/myFunctions',
            zipTarget: '/myTarget'
        },
        mockFs
    )

    const blueZipInput = zipFolder.mock.calls[0].arguments[0]
    assert.deepEqual(blueZipInput, {
        source: '/myFunctions/blue',
        target: '/myTarget',
        name: 'blue',
        projectRoot: process.cwd()
    })

    const redZipInput = zipFolder.mock.calls[1].arguments[0]
    assert.deepEqual(redZipInput, {
        source: '/myFunctions/red',
        target: '/myTarget',
        name: 'red',
        projectRoot: process.cwd()
    })
})
