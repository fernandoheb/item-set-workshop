// We use cross-spawn because of issues on Windows.
// See https://github.com/nodejs/node-v0.x-archive/issues/2318
const spawn = require('cross-spawn');

// Use custom HOME if deploying to OpenShift
if (process.env.OPENSHIFT_DATA_DIR)
  process.env.HOME = process.env.OPENSHIFT_DATA_DIR;

// Run bower install
var bower = spawn('bower', ['install']);

// Redirect bower output
process.stdout.write('bower install output:\n');
bower.stdout.pipe(process.stdout);
bower.on('close', function(code) {
  if (!code)
    process.stdout.write('end of bower install.\n');
});