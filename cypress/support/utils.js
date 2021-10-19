const genName = () => {
    return new Date().toLocaleDateString().replace(/\//g, "-") + "--" + parseInt(Math.random() * 1000);
};

export default {
    genName,
};
