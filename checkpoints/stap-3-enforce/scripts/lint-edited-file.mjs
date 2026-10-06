// Agent hook: lints the file an agent just edited and reports problems back to the agent.
// Claude Code (PostToolUse) and GitHub Copilot (postToolUse) both pass the tool input as JSON on stdin.
// Exit code 2 + stderr = "show this to the agent".
import { execFileSync } from 'node:child_process';
import { relative, resolve } from 'node:path';

const input = JSON.parse(await new Promise((done) => {
  let data = '';
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => done(data || '{}'));
}));

const toolInput = input.tool_input ?? input.toolArgs ?? {};
const file = toolInput.file_path ?? toolInput.path;
if (!file) process.exit(0);

const absolute = resolve(file);
const webDir = resolve('web');
if (!absolute.startsWith(webDir)) process.exit(0);

const relativeToWeb = relative(webDir, absolute);
const linters = [];
if (/\.(ts|tsx)$/.test(absolute)) linters.push(['npx', ['eslint', '--max-warnings=0', relativeToWeb]]);
if (/\.css$/.test(absolute)) linters.push(['npx', ['stylelint', relativeToWeb]]);

for (const [command, args] of linters) {
  try {
    execFileSync(command, args, { cwd: webDir, stdio: 'pipe' });
  } catch (error) {
    process.stderr.write(`${error.stdout ?? ''}${error.stderr ?? ''}\nFix these lint problems before continuing.\n`);
    process.exit(2);
  }
}
