import { combineReducers } from "redux"

const initialState = {
    id: null
}
const userreducer = (state = initialState, action) => {

    if (action.type == "ACTIVE_USER") {

        return { ...state, id: action.payload }

    } else {
        return state
    }
}

const rooteReducer = combineReducers({
    activeusers: userreducer
})
export default rooteReducer