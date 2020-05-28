import { getCurrentTime } from '../uitls'
export const setRoom = (state, room) => {
  state.room = room;
}
export const setConnIsReady = (state, val) => {
  state.connIsReady = val;
}
export const setMeName = (state, name) => {
  state.state.name = name
}
export const setShowChat = (state, val) => {
  state.state.showChat = val;
}
export const setShowControls = (state, val) => {
  state.state.showControls = val;
}
export const setMuted = (state, value) => {
  state.state.muted = value
}

export const setPaused = (state, value) => {
  state.state.paused = value
}

export const addPeer = (state, { video, peer }) => {
  state.clients.push({ video, peer })
}

export const removePeer = (state, peer) => {
  state.clients = state.clients.filter(client => {
    if (client.peer.id === peer.id && client.peer.type === peer.type) return false;
    return true;
  })
}

export const addMessage = (state, message) => {
  state.messages.push({ time: getCurrentTime(), ...message });
}
export const setScreenSharing = (state, value) => {
  state.state.screenSharing = value
}

export const setShowTeacherBoard = (state, val) => {
  state.state.showTeacherBoard = val;
}

export const setIsSketching = (state, val) => {
  state.state.isSketching = val;
}

export const setDarkTheme = (state, val) => {
  state.darkTheme = val;
}
export const switchTheme = (state) => {
  state.darkTheme = !state.darkTheme;
}
