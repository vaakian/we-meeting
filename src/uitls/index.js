export const enumerateDevices = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        if (devices.length) {
          let audio = devices.filter(device => device.kind === 'audioinput').length > 0;
          let video = devices.filter(device => device.kind === 'videoinput').length > 0;
          console.log(devices);
          resolve({ audio, video });
        } else {
          reject('zero device was found')
        }
      }).catch(err => reject(err))
  })
}