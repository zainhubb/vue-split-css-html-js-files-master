const fs = require('fs')
const path = require('path')
const templateReg = /<template>[\s\S]*<\/template>/
const scriptReg = /<script>[\s\S]*<\/template>/
const style1Reg = /<style>[\s\S]*<\/style>/
const style2Reg = /<style scoped lang="scss">[\s\S]*<\/style>/
const style3Reg = /<style lang="scss" scoped>[\s\S]*<\/style>/
fs.readFile((path.join(__dirname,process.argv.slice(2)[0])),'utf8',(err,data)=>{
  console.log(data);
})
