import test from 'node:test'
import assert from 'assert'
import { deployCodeBucket } from '../index.mjs'

test('deployCodeBucket will return bucket namae', async (t) => {
    const deployMock = t.mock.fn(() => {
        return {
            status: 'ok',
            outputs: {
                MainBucket: 'test-bucket'
            }
        }
    })

    const result = await deployCodeBucket(
        {
            name: 'test',
            stage: 'dev',
            region: 'us-east-1'
        },
        {
            deployInfraMock: deployMock
        }
    )
    assert.strictEqual(result, 'test-bucket')
})

test('deployCodeBucket will throw error if return value is error', async (t) => {
    const deployMock = t.mock.fn(() => {
        return {
            status: 'error',
            message: 'the error'
        }
    })

    try {
        await deployCodeBucket(
            {
                name: 'test',
                stage: 'dev',
                region: 'us-east-1'
            },
            {
                deployInfraMock: deployMock
            }
        )
    } catch (e) {
        assert.strictEqual(e.message, 'the error')
    }
})

test('deployCodeBucket will set name, stage, and region correctly', async (t) => {
    const deployMock = t.mock.fn(() => {
        return {
            status: 'ok',
            outputs: {
                MainBucket: 'test-bucket'
            }
        }
    })

    await deployCodeBucket(
        {
            name: 'test',
            stage: 'dev',
            region: 'us-east-1'
        },
        {
            deployInfraMock: deployMock
        }
    )

    const resultName = deployMock.mock.calls[0].arguments[0].name
    assert.strictEqual(resultName, 'testdev-bucket')

    const resultRegion = deployMock.mock.calls[0].arguments[0].region
    assert.strictEqual(resultRegion, 'us-east-1')

    const resultStage = deployMock.mock.calls[0].arguments[0].stage
    assert.strictEqual(resultStage, 'dev')
})
