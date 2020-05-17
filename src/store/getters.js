export const getRoom = (state) => {
  return state.room
}
export const getName = (state) => {
  return state.state.name
}

export const getState = (state) => {
  return state.state
}

export const getVideoClients = (state) => {
  return state.clients.filter(client => client.peer.type === 'video')
}

export const getScreenClients = (state) => {
  return state.clients.filter(client => client.peer.type === 'screen')
}


export const getMessages = (state) => {
  return state.messages
}

export const getConnIsReady = (state) => {
  return state.connIsReady;
}