let initSate = {
    token: null
}
const saveTokenToStore = (token) => {
    return {
        type: 'ADD',
        payload:token
    }
}
//use for admin
const recombeetokenReducer = (state = initSate, action) => {
    switch (action.type) {
        case 'ADD':
            state.token = action.payload;
            return { ...state }
        default:
            return state;
    }
}

export default {
    saveTokenToStore,
    recombeetokenReducer
}