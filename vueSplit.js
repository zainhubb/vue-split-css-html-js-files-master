function walkSync(currentDirPath, callback) {
  var fs = require("fs"),
    path = require("path");
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function(
    dirent
  ) {
    var filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile() && filePath.slice(-4) == ".vue") {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}
function split(filePath) {
  if (!filePath) return;
  const fs = require("fs");
  const path = require("path");
  const templateReg = /<template>[\s\S]*<\/template>/;
  const scriptReg = /<script>[\s\S]*<\/script>/;
  const style1Reg = /<style>[\s\S]*<\/style>/;
  const style2Reg = /<style scoped>[\s\S]*<\/style>/;
  const style3Reg = /<style scoped lang="scss">[\s\S]*<\/style>/;
  const style4Reg = /<style lang="scss" scoped>[\s\S]*<\/style>/;
  const style5Reg = /<style lang="scss">[\s\S]*<\/style>/;
  let vueTemplate = "";
  let scriptTemplate = "";
  let styleTemplate = "";
  let fileType = "css";
  const fileName = filePath.split("/").slice(-1)[0];
  const writeTemplate = () => {
    fs.writeFile(filePath, vueTemplate, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`${filePath}创建成功`);
    });
  };
  const writeJs = () => {
    fs.writeFile(`${filePath}.js`, scriptTemplate, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`${filePath}.js创建成功`);
    });
  };
  const writeStyle = () => {
    fs.writeFile(`${filePath}.${fileType}`, styleTemplate, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`${filePath}.${fileType}创建成功`);
    });
  };
  fs.readFile(filePath, "utf8", (err, data) => {
    const templateMatch =
      (templateReg.exec(data) && templateReg.exec(data)[0]) || "";
    const scriptMatch = (scriptReg.exec(data) && scriptReg.exec(data)[0]) || "";
    const style1Match = (style1Reg.exec(data) && style1Reg.exec(data)[0]) || "";
    const style2Match = (style2Reg.exec(data) && style2Reg.exec(data)[0]) || "";
    const style3Match = (style3Reg.exec(data) && style3Reg.exec(data)[0]) || "";
    const style4Match = (style4Reg.exec(data) && style4Reg.exec(data)[0]) || "";
    const style5Match = (style5Reg.exec(data) && style5Reg.exec(data)[0]) || "";
    vueTemplate = `   ${templateMatch}   <script src="./${fileName}.js"></script>   `;
    scriptTemplate =
      scriptMatch && scriptMatch.replace(/<script>|<\/script>/g, "");
    styleTemplate = (
      style1Match ||
      style2Match ||
      style3Match ||
      style4Match ||
      style5Match
    ).replace(
      /<style>|<style scoped>|<style lang="scss">|<style lang="scss" scoped>|<style scoped lang="scss">|<\/style>/g,
      ""
    );
    if (style1Match) {
      vueTemplate = `       ${templateMatch}       <script src="./${fileName}.js"></script>       <style src="./${fileName}.css"></style>       `;
    }
    if (style2Match) {
      vueTemplate = `       ${templateMatch}       <script src="./${fileName}.js"></script>       <style scoped src="./${fileName}.css"></style>`;
    }
    if (style3Match || style4Match) {
      vueTemplate = `       ${templateMatch}       <script src="./${fileName}.js"></script>       <style scoped lang="scss" src="./${fileName}.scss"></style>       `;
      fileType = "scss";
    }
    if (style5Match) {
      vueTemplate = `       ${templateMatch}       <script src="./${fileName}.js"></script>       <style lang="scss" src="./${fileName}.scss"></style>       `;
      fileType = "scss";
    }
    writeTemplate();
    writeJs();
    writeStyle();
  });
}
walkSync("src", function(filePath, stat) {
  split(filePath);
});
