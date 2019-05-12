export function showSuccessMsg(msg) {
  return {
    type: 'SHOW_MSG',
    payload: { data:msg, type: 'success'}
  };
}

export function showWarningMsg(msg) {
  return {
    type: 'SHOW_MSG',
    payload: { data:msg, type: 'warning' }
  };
}

export function showErrorMsg(msg) {
  return {
    type: 'SHOW_MSG',
    payload: { data:msg, type: 'error' },
  };
}


