import { deployCodeBucket } from '../index.mjs'

async function main() {
    const bucketName = await deployCodeBucket({
        name: 'deploycodetest2',
        stage: 'dev',
        region: 'us-east-1'
    })

    console.log(bucketName)
}

main()
