const exec = require('child_process').exec;

const OUTPUT_FILE = 'out/build.js';

module.exports = {
	watch: true,
	entry: './out/index.js',
	output: {
		path: __dirname,
		filename: 'index.js'
	},

	mode: 'none',

	optimization: {
		minimize: false
	},

	plugins: [{
		apply: (compiler) => {
			compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
				exec('dts-generator --project ./ --out index.d.ts', (err, stdout, stderr) => {
					if (stdout) process.stdout.write(stdout);
					if (stderr) process.stderr.write(stderr);
				});
			});
		}
	}],

	module: {
		rules: [{
			test: /\.txt$/,
			use: [{
				loader: 'raw-loader',
			}]
		}]
	}
};
