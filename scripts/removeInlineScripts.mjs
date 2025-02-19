/* eslint no-console: off */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { resolve } from 'path';

const INLINE_SCRIPT_MARK = 'replacement_marker';

const basePath = '_next';
const distDir = '.next';

// Match inline scripts and content, skip for next-themes script
const scriptElementMatcher = /<script>((?:(?!colorScheme).)*?)<\/script>/gs;

console.log('Grabbing HTML files...');

const baseDir = resolve(distDir);
const htmlFiles = globSync(`${baseDir}/**/*.html`);

htmlFiles.forEach((file) => {
  const contents = readFileSync(file).toString();
  const scripts = [];

  const newFile = contents.replace(scriptElementMatcher, (_, data) => {
    const addReplacementMarker = scripts.length === 0;

    scripts.push(`${data}${data.endsWith(';') ? '' : ';'}`);

    return addReplacementMarker ? INLINE_SCRIPT_MARK : '';
  });

  if (!scripts.length) {
    return;
  }

  console.log(`\tRewriting ${file}`);

  const chunk = scripts.join('');
  const hash = createHash('md5').update(chunk).digest('hex');

  writeFileSync(`${baseDir}/static/chunks/${hash}.js`, chunk);
  writeFileSync(
    file,
    newFile.replace(
      INLINE_SCRIPT_MARK,
      `<script src="/${basePath}/static/chunks/${hash}.js"></script>`,
    ),
  );

  console.log('\t\tfinished\n');
});
