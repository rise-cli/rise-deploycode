import { removeInfra } from 'rise-deployinfra'
import { emptyCodeBucket } from '../index.mjs'
const bucketId = 'deploycodetest2dev-bucketdev-mainbucket-1e4kf5kmio6ms'

async function main() {
    /**
     * Remove app
     */
    const result = await removeInfra({
        name: 'deploycodetestapp',
        stage: 'dev',
        region: 'us-east-1'
    })

    console.log(result)

    /**
     * Empty and remove code bucket
     */
    await emptyCodeBucket({
        bucketName: bucketId
    })

    /**
     * Remove bucket template
     */
    await removeInfra({
        name: 'deploycodetest2dev-bucket',
        stage: 'dev',
        region: 'us-east-1'
    })
}

main()
