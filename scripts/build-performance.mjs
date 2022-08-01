import { $, path, argv } from 'zx';

const tryNumber = argv['try'];
const appName = argv['app-name'];
const useBuilt = argv['use-built'];

for (let i = 0; i < tryNumber; i++) {
  if (!useBuilt) {
    console.log(`Start ${i} tries`);
    await $`yarn dlx rimraf **/.next`;
    await $`yarn workspace @flex-apps/${appName} build-app`;
  }

  const makeTreeScriptPath = path.join(__dirname, './trace-to-tree.mjs');
  const traceFilePath = path.join(
    __dirname,
    `../web-applications/${appName}/.next/trace`
  );
  const resultFilePath = path.join(__dirname, `../${appName}-${i}.txt`);
  await $`yarn node ${makeTreeScriptPath} ${traceFilePath} > ${resultFilePath}`;
}
