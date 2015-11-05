export const development = {
    network: {
        timeMeasured: 8
    },
    sar:{
        interval: 1,
        count: 3
    },
    ping: {
        nationalHost: process.env.PING_NATIONAL || 'www.plp.com',
        internationalHost: process.env.PING_INTERNATIONAL || 'www.9gag.com',
        attempts: 6
    },
    cpu: {
        timeMeasured: 10
    },
    dicom: {
        host: process.env.DICOM_HOST || 'falp.biopacs.com',
        port: process.env.DICOM_PORT || 11112,
        eac:  process.env.DICOM_EAC || 'MIRROR_FALP',
        timeout: process.env.DICOM_TIMEOUT || 2 // secs
    }
}

export const production = {
    ...development,
    ping: {
        nationalHost: process.env.PING_NATIONAL || 'www.emol.com',
        internationalHost: process.env.PING_INTERNATIONAL || 'www.nytimes.com',
        attempts: 10
    }
}

export const testing = {
    ...development,
    network: {
        timeMeasured: 2
    },
    sar: {
        interval: 1,
        count: 1
    },
    ping: {
        nationalHost: process.env.PING_NATIONAL || 'www.gob.cl',
        internationalHost: process.env.PING_INTERNATIONAL || 'www.speedtest.net',
        attempts: 1
    },
    cpu: {
        timeMeasured: 2
    },
    dicom: {
        host: process.env.DICOM_HOST || 'falp.biopacs.com',
        port: process.env.DICOM_PORT || 11112,
        eac: process.env.DICOM_EAC || 'MIRROR_FALP',
        timeout: process.env.DICOM_TIMEOUT || 1 // secs
    }
}