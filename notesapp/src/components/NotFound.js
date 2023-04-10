// NotFound.js
import React, { Component } from "react";
import { withRouter } from '../common/with-router';

class NotFound extends Component {
    render() {
        return (
            <h1>Page Not Found</h1>
        );
    }
}


export default withRouter(NotFound);
