import program from 'commander';
import request from 'request';
import fs from 'fs';
import chalk from 'chalk';

const WINDOWS = process.platform === 'win32';

const HOSTS = WINDOWS
  ? 'C:/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts';

const urlHostFileTpl = 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts';

const apply = () => {
  return new Promise((resolve, reject) => {
    request
      .get(urlHostFileTpl)
      .on('error', (err) => reject(err))
      .on('response', response => resolve(response.statusCode))
      .pipe(fs.createWriteStream(HOSTS));
  });
};

program.version('0.1.7');

program
  .command('apply')
  .description('Apply adstop hostfile')
  .action(() => {
    var uid = parseInt(process.env.SUDO_UID);
    if (uid || WINDOWS) {
      apply().then(response => {
        if (response === 200) {
          console.log(chalk.green('☭ Success, reboot ur computer !'));
        }
      }).catch(err => console.log(chalk.red(err)));
    } else {
      console.log(chalk.red(`Program can\'t access on ${HOSTS} without sudo permission`));
    }
  });

program.parse(process.argv);
