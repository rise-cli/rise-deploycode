import { zipCode } from '../index.mjs'

async function main() {
    await zipCode({
        functionsLocation: '/exampleCode/.hidden/lambdas',
        zipTarget: '/exampleCode/.hidden/zips'
    })
}

main()
