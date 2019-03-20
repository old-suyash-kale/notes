export default (p, d)=> {
    for (let k in d) {
        if (k && !p.hasOwnProperty(k)) {
            p[k] = d[k];
        }
    };
    return p;
};