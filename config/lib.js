export let development = {
    sar:{
        interval: 1,
        count: 3
    },
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 8
    }
};

export let production = {
    sar:{
        interval: 1,
        count: 3
    },
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 8
    }
};

export let test = {
    sar: {
        interval: 1,
        count: 1
    },
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 2
    }
};