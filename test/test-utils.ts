import * as chai from "chai";

const chaiHttp = require('chai-http');

import app from "./../src/app";
import db from "./../src/models/Connection";

chai.use(chaiHttp);
const expect = chai.expect;

const handleError = error => {
    const message:string = (error.response) ? error.response.res.next : error.message || error;
    return Promise.reject(`${error.name}: ${error.message}`);
};

export {
    app,
    db,
    chai,
    expect,
    handleError
}