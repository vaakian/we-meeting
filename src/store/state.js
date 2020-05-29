const darkTheme = eval(localStorage.getItem('darkTheme'));
export default {
  room: '',
  connIsReady: false,
  darkTheme,
  isMobile: false,
  state: {
    name: '',
    muted: false,
    paused: false,
    screenSharing: false,
    showChat: false,
    showControls: true,
    showTeacherBoard: false,
    isSketching: false
  },
  clients: [],
  messages: []
}