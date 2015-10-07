import express from 'express';
import * as controller from './controller.js';

let router = express.Router();
router.get('/', controller.allInfo);
router.get('/node', controller.nodeInfo);
router.get('/cpu', controller.cpuInfo);
router.get('/ram', controller.ramInfo);
router.get('/disc', controller.spaceInfo);
router.get('/discIO', controller.discIOInfo);
router.get('/netIO', controller.netIOInfo);
router.get('/ping', controller.pingInfo);
router.get('/ping/:pingHost', controller.pingCustom);
//router.get('/dicom', controller.getCpu);

router.param('pingHost', function (req, res, next, pingHost) {
    if(!pingHost || pingHost.length==0){
        res.status(400).json({
            error: 'necesita un host'
        })
    }else{
        next();
    }
});

export default router;