export const development = {
    network: {
        timeMeasured: 8
    },
    sar:{
        interval: 1,
        count: 3
    },
    ping: {
        nationalHost: 'www.plp.com',
        internationalHost: 'www.nytimes.com',
        attempts: 6
    }
}

export const production = Object.assign({}, development, {
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 10
    }
})

export const testing = Object.assign({}, development, {
    network: {
        timeMeasured: 2
    },
    sar: {
        interval: 1,
        count: 1
    },
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 2,
    }
})