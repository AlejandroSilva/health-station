const version = 'v1.6.1'

export const development = {
    port: process.env.PORT || 8383,
    version
}

export const production = {
    port: process.env.PORT || 8008,
    version
}

export const testing = {
    port: process.env.PORT || 3003,
    version
}