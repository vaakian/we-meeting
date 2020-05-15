export const getRoom = (state) => {
  return state.room
}
export const getName = (state) => {
  return state.state.name
}

export const getState = (state) => {
  return state.state
}

export const getClients = (state) => {
  return state.clients
}

export const getMessages = (state) => {
  return state.messages
}

export const getConnIsReady = (state) => {
  return state.connIsReady;
}