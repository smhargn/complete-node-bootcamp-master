const { log } = require('console');
const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file,(err,data) => {
            if (err) reject('I could not find that file');
            resolve(data);
        });
    });
};

const writeFilePro = (file,data) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(file,data, err => {
            if (err) reject('Could not write file');
            resolve('success');
        })

    });
};

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`
        );

        const res2Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`
        );

        const res3Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`
        );

        const all = await Promise.all([res1Pro,res2Pro,res3Pro]);
        const imgs = all.map(res => res.body.message);
        console.log(imgs);



        await writeFilePro('dog-img.txt', imgs.join('\n')  );
        console.log('Random dog image saved to file!');
    } catch (error) {
        console.log(error);
    }
    return '2.Ready';
    
};

( async () => {
    try {
        console.log("1 : Wil Geto")
        const x = await getDogPic();
        console.log(x); // '2. Ready'
        console.log("3 : Done Geto");
    } catch (error) {
        console.log(error);

    }
})();


// console.log("1 : Wil Geto")
// getDogPic().then(x => {
//     console.log(x);
//     console.log("3 : Done Geto");
// });


/* readFilePro(`${__dirname}/dog.txt`)
    .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    })
    .then(res => {
        console.log(res.body.message);

        return writeFilePro('dog-img.txt', res.body.message);

        // fs.writeFile('dog-img.txt', res.body.message, (err) => {
        //     if (err) return console.error(err.message);
        //     console.log('Random dog image saved to file!');
        // })

    })
    .then(() => console.log('Random dog image saved to file!'))
    .catch(err => {
        console.error(err.message);
    }); */


// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
    
//     console.log(`Breed: ${data}`);
//     superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`).then(res => {
//         console.log(res.body.message);

//         fs.writeFile('dog-img.txt', res.body.message, (err) => {
//             if (err) return console.error(err.message);
//             console.log('Random dog image saved to file!');
//         })

//     })
//     .catch(err => {
//         console.error(err.message);
//     });
// });

