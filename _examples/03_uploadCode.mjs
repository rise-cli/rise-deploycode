import { uploadCode } from '../index.mjs'
const bucketId = 'deploycodetest2dev-bucketdev-mainbucket-1e4kf5kmio6ms'

async function main() {
    await uploadCode({
        bucketName: bucketId,
        functionsLocation: '/exampleCode/.hidden/lambdas',
        zipTarget: '/exampleCode/.hidden/zips',
        hiddenFolder: '.hidden'
    })
}

main()
