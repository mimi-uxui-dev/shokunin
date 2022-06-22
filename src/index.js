/**
 * 
 * 
### 8. run project
```bash
npm start 

// before deploying, run 

npm run build
git add -A
git commit -m 'Some message'
git push
```

 */

const csjs = require('csjs-inject')
const bel = require('bel')
const navigation = require("./navigation.js")



function start () {
  const el = document.createElement('div')
  el.appendChild = 'Hello world'
  document.body.appendChild(el)
}

start()