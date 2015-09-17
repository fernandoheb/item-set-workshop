// We use cross-spawn because of issues on Windows.
// See https://github.com/nodejs/node-v0.x-archive/issues/2318
const spawn = require('cross-spawn');

// Use custom HOME if deploying to OpenShift
if (process.env.OPENSHIFT_DATA_DIR)
  process.env.HOME = process.env.OPENSHIFT_DATA_DIR;

var child = spawn(process.argv[2], process.argv.slice(3));

// Redirect program output
process.stdout.write('HOMERUN START: ' + process.argv[2] + '\n');
child.stdout.on('end', function() {
  process.stdout.write('HOMERUN END: ' + process.argv[2] + ' (SUCCESSFUL)' + '\n');
});
child.stdout.pipe(process.stdout, {end: false});