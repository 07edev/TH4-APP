const NetInfo = {
  addEventListener: callback => {
    callback({isConnected: true, isInternetReachable: true});
    return () => {};
  },
  fetch: async () => ({isConnected: true, isInternetReachable: true}),
};

module.exports = NetInfo;
