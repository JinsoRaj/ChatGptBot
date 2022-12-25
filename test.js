const str = 'the quicks of baar';

const res = str.match(/.{1,9}(?:\s|$)/g)

for (const item in res) {
    console.log(res[item]);
}
