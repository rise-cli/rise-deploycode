import * as filesystem from 'rise-filesystem-foundation'
import * as aws from 'rise-aws-foundation'
import { deployInfra } from 'rise-deployinfra'
import process from 'node:process'
import awsReal from 'aws-sdk'
const s3 = new awsReal.S3({
    region: 'us-east-1'
})

/**
 * Deploy code bucket
 *
 * @param {string} appName
 * @param {string} stage
 * @param {string} region
 */
export async function deployCodeBucket(
    { name, stage, region },
    { deployInfraMock }
) {
    const bucketTemplate = aws.s3.makeBucket('Main')
    const stackName = name + stage + '-bucket'

    const deploy = deployInfraMock || deployInfra
    const result = await deploy({
        name: stackName,
        stage,
        region,
        template: JSON.stringify(bucketTemplate),
        outputs: ['MainBucket']
    })

    if (result.status === 'error') {
        throw new Error(result.message)
    }

    // filesystem.writeFile({
    //     path: '/.rise/data.js',
    //     content: `export const config = { bucketName: "${result.outputs.MainBucket}"}`,
    //     projectRoot: process.cwd()
    // })

    return result.outputs.MainBucket
}

/**
 * Zip code
 *
 * @param {object} config
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 */
export async function zipCode(config, mockFilesystem) {
    const fs = mockFilesystem || filesystem
    function getLambdaFunctionPaths(folderName) {
        let lambdas = []
        try {
            lambdas = fs.getDirectories({
                path: folderName,
                projectRoot: process.cwd()
            })
        } catch (e) {
            lambdas = []
        }

        return lambdas.map((name) => {
            return {
                path: folderName + '/' + name,
                name
            }
        })
    }

    const lambdas = getLambdaFunctionPaths(config.functionsLocation)
    for (const lambda of lambdas) {
        await fs.zipFolder({
            source: lambda.path,
            target: config.zipTarget,
            name: lambda.name,
            projectRoot: process.cwd()
        })
    }
}

/**
 * Upload code to bucket
 *
 * @param {object} config
 * @param {string} config.bucketName
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 * @param {string} config.hiddenFolder
 */
export async function uploadCode(config, mock) {
    const fs = mock?.filesystem || filesystem
    const uploadFile = mock?.uploadFile || aws.s3.uploadFile
    const getAllPaths = () => {
        const lambaPaths = config.functionsLocation
        const lambdas = fs.getDirectories({
            path: lambaPaths,
            projectRoot: process.cwd()
        })
        return lambdas.map((name) => `${config.zipTarget}/${name}.zip`)
    }

    let result = []
    const paths = getAllPaths()
    for (const path of paths) {
        const file = await fs.getFile({
            path,
            projectRoot: process.cwd()
        })
        const res = await uploadFile({
            file,
            bucket: config.bucketName,
            key: path.split(config.hiddenFolder + '/')[1]
        })
        result.push(res)
    }

    return result
}

/**
 * Update lambda code
 *
 * @param {string} appName
 * @param {string} stage
 * @param {string} region
 * @param {string} bucket
 * @param {object} config
 * @param {string} config.functionsLocation
 * @param {string} config.zipTarget
 * @param {string} config.hiddenFolder
 */
export async function updateLambdaCode(
    { appName, stage, region, bucket, zipConfig },
    mock
) {
    const getDirectories = mock.getDirectories || filesystem.getDirectories
    const updateCode = mock.updateCode || aws.lambda.updateLambdaCode

    const getAllPaths = () => {
        const lambaPaths = zipConfig.functionsLocation
        const lambdas = getDirectories({
            path: lambaPaths,
            projectRoot: process.cwd()
        })
        const path = zipConfig.zipTarget.split(zipConfig.hiddenFolder + '/')[1]
        return [
            ...lambdas.map((x) => ({
                path: `${path}/${x}.zip`,
                name: x
            }))
        ]
    }

    const getFunctionName = (name) => `${appName}-${name}-${stage}`
    for (const l of getAllPaths()) {
        const lambdaName = getFunctionName(l.name)

        await updateCode({
            name: lambdaName,
            filePath: l.path,
            bucket: bucket,
            region
        })
    }
}

/**
 * Empty and remove bucket
 *
 * @param {string} bucketName
 * @param {string} [keyPrefix]
 */
export async function emptyCodeBucket({ bucketName, keyPrefix }) {
    const resp = await s3
        .listObjectsV2({
            Bucket: bucketName
        })
        .promise()

    const contents = resp.Contents
    let testPrefix = false
    let prefixRegexp
    if (!contents[0]) {
        return Promise.resolve()
    } else {
        if (keyPrefix) {
            testPrefix = true
            prefixRegexp = new RegExp('^' + keyPrefix)
        }
        const objectsToDelete = contents
            .map((content) => ({ Key: content.Key }))
            .filter((content) => !testPrefix || prefixRegexp.test(content.Key))

        const willEmptyBucket = objectsToDelete.length === contents.length

        if (objectsToDelete.length === 0) {
            return Promise.resolve(willEmptyBucket)
        }

        const params = {
            Bucket: bucketName,
            Delete: { Objects: objectsToDelete }
        }

        await s3.deleteObjects(params).promise()
        return willEmptyBucket
    }
}
