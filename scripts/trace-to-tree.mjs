import fs from 'fs';
import eventStream from 'event-stream';
import chalk from 'chalk';

const file = fs.createReadStream(process.argv[2]);

const sum = (...args) => args.reduce((a, b) => a + b, 0);

const aggregate = event => {
  const isBuildModule = event.name.startsWith('build-module-');

  event.range = event.timestamp + (event.duration || 0);
  event.total = isBuildModule ? event.duration : 0;

  if (!event.children) {
    return;
  }

  if (isBuildModule) {
    const queue = [...event.children];

    event.packageName = getPackageName(event.tags.name);
    event.children = [];
    event.childrenTimings = {};
    event.mergedChildren = 0;

    for (const item of queue) {
      if (!item.name.startsWith('build-module-')) {
        event.childrenTimings[item.name] =
          (event.childrenTimings[item.name] || 0) + item.duration;
        continue;
      }

      const packageName = getPackageName(item.tags.name);
      if (!event.packageName || packageName !== event.packageName) {
        event.children.push(item);
        continue;
      }

      event.duration += item.duration;
      event.mergedChildren++;

      if (item.children) {
        queue.push(...item.children);
      }
    }
  }

  event.children.forEach(aggregate);
  event.children.sort((a, b) => a.timestamp - b.timestamp);
  event.range = Math.max(
    event.range,
    ...event.children.map(c => c.range || event.timestamp)
  );

  event.total += isBuildModule
    ? sum(...event.children.map(c => c.total || 0))
    : 0;
};

const formatDuration = (duration, bold) => {
  const color = bold ? chalk.bold : x => x;
  if (duration < 1000) {
    // 1ms under
    return color(`${duration} µs`);
  } else if (duration < 10_000) {
    // 10ms under
    return color(`${Math.round(duration / 100) / 10} ms`);
  } else if (duration < 100_000) {
    // 100ms under
    return color(`${Math.round(duration / 1000)} ms`);
  } else if (duration < 1_000_000) {
    // 1s under
    return color(chalk.cyan(`${Math.round(duration / 1000)} ms`));
  } else if (duration < 10_000_000) {
    // 10s under
    return color(chalk.green(`${Math.round(duration / 100000) / 10}s`));
  } else if (duration < 20_000_000) {
    // 20s under
    return color(chalk.yellow(`${Math.round(duration / 1000000)}s`));
  } else if (duration < 100_000_000) {
    // 100s under
    return color(chalk.red(`${Math.round(duration / 1000000)}s`));
  } else {
    return color('🔥' + chalk.red(`${Math.round(duration / 1000000)}s`));
  }
};

const formatTimes = event => {
  const range = event.range - event.timestamp;
  const additionalInfo = [];
  if (event.total && event.total !== range) {
    additionalInfo.push(`total ${formatDuration(event.total)}`);
  }
  if (event.duration !== range) {
    additionalInfo.push(`self ${formatDuration(event.duration, chalk.bold)}`);
  }
  return `${formatDuration(range, additionalInfo.length === 0)}${
    additionalInfo.length ? ` (${additionalInfo.join(', ')})` : ''
  }`;
};

const formatFilename = filename => {
  return cleanFilename(filename).replace(/.+[\\/]node_modules[\\/]/, '');
};

const cleanFilename = filename => {
  let result = '';

  if (filename.includes('&absolutePagePath=')) {
    result =
      'page ' +
      decodeURIComponent(
        filename.replace(/.+&absolutePagePath=/, '').slice(0, -1)
      );
  }
  result = filename.replace(/.+!(?!$)/, '');

  return result;
};

const getPackageName = filename => {
  const match = /.+[\\/]node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/.exec(
    cleanFilename(filename)
  );
  return match && match[1];
};

const formatEvent = event => {
  let head = '';

  switch (event.name) {
    case 'webpack-compilation': {
      const duration = formatTimes(event);

      head = `${chalk.bold(`${event.tags.name} compilation`)} ${duration}`;
      break;
    }
    case 'webpack-invalidated-client':
    case 'webpack-invalidated-server': {
      const target = event.name.slice(-6);

      const reason =
        event.tags.trigger === 'manual'
          ? '(new page discovered)'
          : `(${formatFilename(event.tags.trigger)})`;

      const duration = formatTimes(event);

      head = `${chalk.bold(`${target} recompilation`)} ${reason} ${duration}`;

      break;
    }

    case 'add-entry': {
      const fileName = formatFilename(event.tags.request);
      const duration = formatTimes(event);

      head = `${chalk.blueBright('entry')} ${fileName} ${duration}`;

      break;
    }
    case 'hot-reloader': {
      head = `${chalk.bold.green(`hot reloader`)}`;
      break;
    }
    default: {
      const isBuildModule = event.name.startsWith('build-module-');

      if (!isBuildModule) {
        head = `${event.name} ${formatTimes(event)}`;
        break;
      }

      const { mergedChildren, childrenTimings, packageName } = event;

      const moduleFilePath = formatFilename(event.tags.name);
      const duration = formatTimes(event);

      if (packageName) {
        const numOfMergedModules = mergedChildren ? ` + ${mergedChildren}` : '';

        const description = `(${moduleFilePath}${numOfMergedModules})`;

        head = `module ${packageName} ${description} ${duration}`;
      }

      head = `module ${moduleFilePath} ${duration}`;

      if (childrenTimings && Object.keys(childrenTimings).length !== 0) {
        const pipes = Object.keys(childrenTimings)
          .map(key => `${key} ${formatDuration(childrenTimings[key])}`)
          .join(', ');

        head += ` [${pipes}]`;
      }

      break;
    }
  }

  if (event.children && event.children.length !== 0) {
    return head + '\n' + treeChildren(event.children.map(formatEvent));
  } else {
    return head;
  }
};

const indentWith = (str, firstLinePrefix, otherLinesPrefix) => {
  return firstLinePrefix + str.replace(/\n/g, '\n' + otherLinesPrefix);
};

const treeChildren = items => {
  let str = '';
  for (let i = 0; i < items.length; i++) {
    if (i !== items.length - 1) {
      str += indentWith(items[i], '├─ ', '│  ') + '\n';
    } else {
      str += indentWith(items[i], '└─ ', '   ');
    }
  }
  return str;
};

const tracesById = new Map();

const EXPLANATION = `Explanation:
${formatEvent({
  name: 'build-module-js',
  tags: { name: '/Users/next-user/src/magic-ui/pages/index.js' },
  duration: 163000,
  timestamp: 0,
  range: 24000000,
  total: 33000000,
  childrenTimings: { 'read-resource': 873, 'next-babel-turbo-loader': 135000 },
})}
       ════════╤═══════════════════════════════════ ═╤═        ═╤═       ═╤════   ═══════════╤════════════════════════════════════════
               └─ name of the processed module       │          │         │                  └─ timings of nested steps
                                                     │          │         └─ building the module itself (including overlapping parallel actions)
                                                     │          └─ total build time of this modules and all nested ones (including overlapping parallel actions)
                                                     └─ how long until the module and all nested modules took compiling (wall time, without overlapping actions)

${formatEvent({
  name: 'build-module-js',
  tags: {
    name: '/Users/next-user/src/magic-ui/node_modules/lodash/camelCase.js',
  },
  packageName: 'lodash',
  duration: 958000,
  timestamp: 0,
  range: 295000,
  childrenTimings: { 'read-resource': 936000 },
  mergedChildren: 281,
})}
       ═╤════  ══════╤════════════   ═╤═
        │            │                └─ number of modules that are merged into that line
        │            └─ first module that is imported
        └─ npm package name

`;

file
  .pipe(eventStream.split())
  .pipe(
    eventStream.mapSync(data => {
      if (!data) {
        return;
      }
      const json = JSON.parse(data);

      json.forEach(event => {
        tracesById.set(event.id, event);
      });
    })
  )
  .on('end', () => {
    const rootEvents = [];

    for (const event of tracesById.values()) {
      if (event.parentId) {
        event.parent = tracesById.get(event.parentId);
        if (event.parent) {
          if (!event.parent.children) {
            event.parent.children = [];
          }
          event.parent.children.push(event);
        }
      }

      if (!event.parent) {
        rootEvents.push(event);
      }
    }

    for (const event of rootEvents) {
      aggregate(event);
    }

    console.log(EXPLANATION);

    for (const event of rootEvents) {
      console.log(formatEvent(event));
    }
  });
