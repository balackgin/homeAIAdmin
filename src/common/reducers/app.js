// 对于rekit的扩展
export default function appReducer(state = { spin: false, errors: [], messages:[] }, action) {
  switch (action.type) {
    case "MSG": 
      return { ...state, messages: [...state.messages, action.payload.message] };
    case 'ERROR':
      return { ...state, errors: [...state.errors, action.payload.error] };
    case 'SPIN':
      return { ...state, spin: true };
    case 'UNSPIN':
      return { ...state, spin: false };
    default:
      return state;
  }
}
