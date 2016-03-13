import program from 'commander';
import request from 'request';
import fs from 'fs';

const urlHostFileTpl = 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts';

const apply = () => {
  return new Promise((resolve, reject) => {
    request
      .get(urlHostFileTpl)
      .on('error', (err) => reject(err))
      .on('response', response => resolve(response.statusCode))
      .pipe(fs.createWriteStream('/etc/hosts'));
  });
};

program.version('0.0.1');

program
  .command('apply')
  .description('Apply adstop hostfile')
  .action(() => {
    apply().then(response => {
      if (response === 200){
        console.log('> success, reboot ur computer !')
      }
    }).catch(e => console.log(err));
  });

program.parse(process.argv);
