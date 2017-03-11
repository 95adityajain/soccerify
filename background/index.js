import UserService from "./services/UserService";
import BGUtility from "./utility/index";



BGUtility.registerListenerForNotificationButtonClick();

BGUtility.createCurrentFixturesNotificationAlarm();

chrome.runtime.onStartup.addListener(() => {
    setTimeout(() => {
        UserService.hasFixturesToday().then((hasFixture) => {
            console.log("on startup");
            if (hasFixture) {
                BGUtility.createFixturesNotification();
            }
        });
    }, 5000);
});


//ON INSTALL HANDLER
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("Soccerify Installed Successfully.");
        console.log("initializing user");
        //chrome.runtime.openOptionsPage()
        UserService.initialize();
    }
});


//MESSAGING PASSING HANDLER
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.action  || !sender || (sender.id != chrome.runtime.id)) {
        return;
    }

    switch(message.action) {
        case "get/competitions":
            UserService.getCompetitions().then((competitions) => {
                sendResponse (competitions);
            }).catch(() => {
                sendResponse(false);
            });
            break;

        /*case "get/competitions/fetch_status":
            sendResponse (UserService.getCompetitionFetchStatus ());
            break;*/

        case "get/competitions/teams/":
            UserService.getTeams(message.competitionId).then((res) => {
                sendResponse(res);

                //Simultaneously fetch fixtures while getting teams (with delay of 1 second)
                //and set alarm, if fetching failed, to again try to fetch fixtures when alarm is fired.
                UserService.fetchAndStoreFixturesForCompetition(message.competitionId).then(() => {
                    BGUtility.removeFetchFixturesAlarm(message.competitionId);
                }).catch(() => {
                    BGUtility.createFetchFixturesAlarm(message.competitionId);
                });
            }).catch((err) => {
                console.log(err)
                sendResponse(false);
            });
            break;

        case "save/teams/preferences":
            sendResponse(UserService.saveTeamsPreferences(message.competitionId, message.preferences));
            break;

        case "get/competitions/preferences/with_teams":
            UserService.getPreferredCompetitionsWithTeams().then((res) => {
                sendResponse(res);
            }).catch(() => {
                sendResponse(false);
            });
            break;
        case "get/teams/preferences/all":
            UserService.getAllPreferences().then((res) => {
                sendResponse(res);
            }).catch(() => {
                sendResponse(false);
            });
            break;
        case "get/competitions/fixtures/by_matchday":
            UserService.fetchCompetitionsFixturesAndGetByOneMatchday(message.competitionId, message.matchday)
            .then((res) => {
                sendResponse(res);
                BGUtility.removeFetchFixturesAlarm(message.competitionId);
            }).catch(() => {
                sendResponse(false);
                BGUtility.createFetchFixturesAlarm(message.competitionId);
            });
            break;

        case "refresh_get/competitions/fixtures/by_matchday":
            UserService.fetchCompetitionsFixturesAndGetByOneMatchday(message.competitionId, message.matchday, true)
            .then((res) => {
                sendResponse(res);
            }).catch(() => {
                sendResponse(false);
            });
            break;

        default: 
            sendResponse("NO SUCH ACTION");
    }
    return true; //this is to tell runtime, that response will be async;
});


//ALARM HANDLER
chrome.alarms.onAlarm.addListener((alarm) => {
    if (!alarm.name) {
        return;
    }
    console.log("alarm invoked - " + alarm.name);
    if (BGUtility.handleCurrentFixturesNotificationAlarm(alarm) == true) {
        return;
    }
    if (BGUtility.handleFetchFixturesForCompetitionsAlarm(alarm) == true) {
        return;
    }
});
