// This before middleware allows the help command to accept sub-thread names as
// a parameter so users can say help to get the default thread, but help
// <subthread> will automatically jump to that subthread (if it exists)
module.exports = controller => {
  controller.studio.before('help', (convo, next) => {
    const matches = convo.source_message.text.match(/^help (.*)/i);

    if (matches) {
      if (convo.hasThread(matches[1])) {
        convo.gotoThread(matches[1]);
      }
    }

    next();
  });
};
