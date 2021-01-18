

import * as types from '../actions/types';

const initialState = {
    logged_user:"",
};

const assessmentReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case types.LOGGED_USER: {
            return { ...state, logged_user: action.payload };
        }
       
        default: {
            return state;
        }
    }
};

export default assessmentReducer;
