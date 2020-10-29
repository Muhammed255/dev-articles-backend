import fs from 'fs';
import path from 'path';

export default {
    deleteFile(filePath) {
        fs.stat(filePath, err => {
            if(err) {
                console.log(err);
                return;
            }
            const host_url = 'http:\\localhost:3000\\';
            const i = filePath.indexOf(host_url);

            filePath = filePath.substring(0, i) + filePath.substring(host_url.length);
            fs.unlinkSync(path.join(__dirname, '..', filePath));
        });
    }
};
