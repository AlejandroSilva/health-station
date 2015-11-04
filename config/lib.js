const _development = {
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
    },
    cpu: {
        timeMeasured: 10
    },
    dicom: {
        host: 'falp.biopacs.com',
        port: 11112,
        eac: 'MIRROR_FALP',
        timeout: 2 // secs
    }
}

const _production = {
    ..._development,
    network: {
        timeMeasured: 8
    },
    ping: {
        nationalHost: 'www.emol.com',
        internationalHost: 'www.nytimes.com',
        attempts: 10
    }
}

const _testing = {
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
        attempts: 2
    },
    cpu: {
        timeMeasured: 2
    },
    dicom: {
        host: 'falp.biopacs.com',
        port: 11112,
        eac: 'MIRROR_FALP',
        timeout: 1 // secs
    }
}

export const development = _development
export const production = _production
export const testing = _testing