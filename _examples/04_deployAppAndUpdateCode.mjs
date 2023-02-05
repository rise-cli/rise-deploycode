import { deployInfra } from 'rise-deployinfra'
import * as aws from 'rise-aws-foundation'
import { updateLambdaCode } from '../index.mjs'
const bucketId = 'deploycodetest2dev-bucketdev-mainbucket-1e4kf5kmio6ms'

async function main() {
    /**
     * Deploy app
     */
    const template = aws.lambda.makeLambda({
        appName: 'deploycodetestapp',
        name: 'myLambda',
        stage: 'dev',
        bucketArn: 'arn:aws:s3:::' + bucketId,
        bucketKey: 'target/myLambda.zip',
        env: {},
        handler: 'index.handler',
        permissions: []
    })
    console.log(template)

    const result = await deployInfra({
        name: 'deploycodetestapp',
        stage: 'dev',
        region: 'us-east-1',
        template: JSON.stringify(template),
        outputs: []
    })

    console.log(result)

    /**
     * Update lambda code
     */
    await updateLambdaCode({
        appName: 'deploycodetestapp',
        stage: 'dev',
        region: 'us-east-1',
        bucket: bucketId,
        zipConfig: {
            functionsLocation: '/exampleCode/.hidden/lambdas',
            zipTarget: '/exampleCode/.hidden/zips',
            hiddenFolder: '.hidden'
        }
    })
}

main()
