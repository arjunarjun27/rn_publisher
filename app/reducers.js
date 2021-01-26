import { combineReducers } from "redux";

import { GET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM } from "./actions";

let dataState = { items: [] };

const dataReducer = (state = dataState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      let { quote } = action.data;

      let clone = JSON.parse(JSON.stringify(state.items));

      clone.unshift(quote);

      return { ...state, items: clone };

    case GET_ITEMS:
      let { items } = action.data;

      return { ...state, items };

    case UPDATE_ITEM: {
      let { quote } = action.data;

      let clone = JSON.parse(JSON.stringify(state.items));

      const index = clone.findIndex((obj) => obj.id === quote.id);

      if (index !== -1) clone[index] = quote;

      return { ...state, items: clone };
    }

    case DELETE_ITEM: {
      let { id } = action.data;

      let clone = JSON.parse(JSON.stringify(state.items));

      const index = clone.findIndex((obj) => obj.id === id);

      if (index !== -1) clone.splice(index, 1);

      return { ...state, items: clone };
    }

    default:
      return state;
  }
};

const rootReducer = combineReducers({ dataReducer });

export default rootReducer;
