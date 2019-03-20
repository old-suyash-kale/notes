export default function(o, f, v) {
    let fObj = this.state[o];
    if (fObj) {
        fObj[f].value = v;
        this.setState({ [o]: fObj });
    }
};