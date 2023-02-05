# Rise DeployCode

## Install

```
npm i rise-deploycode
```

## Usage

### deployCodeBucket

```js
import { deployCodeBucket } from 'rise-deploycode'
const bucketName = await deployCodeBucket({
    name: 'deploycodetest2',
    stage: 'dev',
    region: 'us-east-1'
})
```

### zipCode

```js
import { zipCode } from 'rise-deploycode'
await zipCode({
    functionsLocation: '/exampleCode/src',
    zipTarget: '/exampleCode/.hidden/target',
    hiddenFolder: '.hidden'
})
```

### uploadCode

```js
import { uploadCode } from 'rise-deploycode'
await uploadCode({
    bucketName: bucketId,
    functionsLocation: '/exampleCode/src',
    zipTarget: '/exampleCode/.hidden/target',
    hiddenFolder: '.hidden'
})
```

### updateLambdaCode

```js
import { updateLambdaCode } from 'rise-deploycode'
await updateLambdaCode({
    appName: 'deploycodetestapp',
    stage: 'dev',
    region: 'us-east-1',
    bucket: bucketId,
    zipConfig: {
        functionsLocation: '/exampleCode/src',
        zipTarget: '/exampleCode/.hidden/target',
        hiddenFolder: '.hidden'
    }
})
```

### emptyCodeBucket

```js
import { emptyCodeBucket } from 'rise-deploycode'
await emptyCodeBucket({
    bucketName: 'nameOfMyBucket'
})
```
