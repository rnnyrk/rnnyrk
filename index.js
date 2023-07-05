// index.js
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');

const MUSTACHE_MAIN_DIR = './main.mustache';

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const apiUrl = 'https://rnny.nl/api/resources';

const getResources = async () => {
    const results = await fetch(`${apiUrl}?type=tweets`)
        .then(response => response.json())

    return results.map(({ title, link, tags }) => { 
        return {
            title,
            link,
            tags: tags.map((tag, index) => {
                return {
                    name: tag.name,
                    slug: tag.name.toLowerCase().replace(' ', '-'),
                    isLast: index === tags.length - 1,
                }
            }),
        }
    });
}

const generateReadMe = async () => {
    const readMeData = {
        resources: (await getResources()).slice(0, 10),
    };

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();