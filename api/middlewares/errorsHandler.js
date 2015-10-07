function unhandledError(err, req, res, next){
    //throw err;
    console.error(err);
    res.status(500).json({
        message: 'Unhandled error',
        original: err.message
    });
};

export default [/*rethinkErrors, thinkyErrors,*/ unhandledError];