import Promise from 'bluebird';



const sendMessageToChrome = function(message) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(message, function(response){
      console.log(response);
      resolve(response);
    });
  });
};

export const getCompetitions = () => {
  return sendMessageToChrome({action: "get/competitions"});
};

