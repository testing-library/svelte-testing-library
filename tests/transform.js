const deasync = require("deasync");
const { compile } = require("./compile");

module.exports.process = (_s, filePath, _c, _o) => {
  let code, map;
  compile(filePath, "App", {}).then(comp => {
    console.log("comp", comp.code);
    code = comp.output[0].code;
    map = comp.output[0].map;
  });
  console.log(code);
  deasync.loopWhile(() => !code && !map);

  return { code, map };
};
