const goodOptions = {
    ops: false,
    reporters: {
        console: [
            {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [
                    {
                        error: '*',
                        log: '*',
                        response: '*',
                        request: '*'
                    }
                ]
            },
            {
                module: '@hapi/good-console'
            },
            'stdout'
        ]
    }
};

export default {
    plugin: require('@hapi/good'),
    options: goodOptions
};
