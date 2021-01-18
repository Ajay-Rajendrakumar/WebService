import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class header extends Component {
    constructor(props) {
        super(props);
        this.state = {    
        }
      }
      componentDidMount(){
      }
     logout = () => {
     }
    render() {
        return (
            <div>
                <header className="header">
                    <div className="row  d-flex justify-content-start">
                    <div className="name-profileImage ">SoA </div>
                        <div className=" text-primary  mt-4 bg-light">
                            <span className="ml85 h5 font-weight-bold">
                                {this.props.page}
                            </span>
                        </div>
                      
                    </div>

                </header>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(header));