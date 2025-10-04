#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { scanFile, detectFeaturesInText } = require('./scanner');
const { predictFeature, predictFromList } = require('./predictor');

const program = new Command();
program.name('baseline-predictor').description('Predict adoption of web features');

program
  .command('feature')
  .argument('<name>')
  .description('Predict a single feature by name')
  .action(async (name) => {
    const result = await predictFeature(name);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('scan')
  .argument('<file>')
  .description('Scan a file containing feature names (one per line)')
  .action(async (file) => {
    const abs = path.resolve(file);
    if (!fs.existsSync(abs)) {
      console.error('File not found:', abs);
      process.exit(1);
    }
    const text = fs.readFileSync(abs, 'utf8');
    const features = detectFeaturesInText(text);
    const report = await predictFromList(features);
    console.log(JSON.stringify(report, null, 2));
  });

program.parseAsync(process.argv);
