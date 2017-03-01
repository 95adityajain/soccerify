import UserService from "../services/UserService";



const CURRENT_FIXTURES_NOTIFICATION = "current_fixtures_notifications";
const CURRENT_FIXTURES_NOTIFICATION_ALARM = "current_fixtures_notifications_alarm";
const FETCH_FIXTURES_FOR_COMPETITIONS_ALARM = "fetch_fixtures";
const NOTIFICATION_ICONS = ["play1.svg", "play2.svg", "play3.svg","football.svg", "football1.png"];
    
const getRandomNotificationIcon = function() {
    return "assests/notification_icons/" + NOTIFICATION_ICONS[Math.floor(Math.random() * NOTIFICATION_ICONS.length)];
};

class BGUtility {

    static createFetchFixturesAlarm(competitionId) {
        console.log("setting fetch fixtures alarm");
        chrome.alarms.create(FETCH_FIXTURES_FOR_COMPETITIONS_ALARM + "/" + competitionId, {
            delayInMinutes: 5, periodInMinutes: 5
        });
    }

    static removeFetchFixturesAlarm(competitionId) {
        console.log("clearing fetch fixtures alarm");
        chrome.alarms.clear(FETCH_FIXTURES_FOR_COMPETITIONS_ALARM + "/" + competitionId);
    }

    static handleFetchFixturesForCompetitionsAlarm(alarm) {
        // "fetch_fixtures/<competitionsId>" = alarm.name format
        let temp = alarm.name.split("/");
        if (temp.length == 2 && temp[0] == FETCH_FIXTURES_FOR_COMPETITIONS_ALARM) {
            UserService.fetchAndStoreFixturesForCompetition(temp[1]).then(() => {
                chrome.alarms.clear(alarm.name);
            }).catch (() => {
                console.log("failed again" + alarm.name);
            });
            return true;
        }
        return false;
    }

    static createCurrentFixturesNotificationAlarm() {
        chrome.alarms.create(CURRENT_FIXTURES_NOTIFICATION_ALARM, {
            delayInMinutes: 60, periodInMinutes: 60
        });
    }

    static handleCurrentFixturesNotificationAlarm(alarm) {
        if (alarm.name != CURRENT_FIXTURES_NOTIFICATION_ALARM) {
            return false;
        }
        UserService.hasFixturesToday().then((hasFixture) => {
            if (hasFixture) {
                BGUtility.createFixturesNotification();
            }
        });
        return true;
    }

    static registerListenerForNotificationButtonClick() {
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            console.log(notificationId + " - " + buttonIndex);
            if (notificationId == CURRENT_FIXTURES_NOTIFICATION) {
                if (buttonIndex == 0) {
                    chrome.tabs.create({url : "popup.html"});
                    //window.open("popup.html", "extension_popup", "width=550,height=550,status=no,scrollbars=yes,resizable=no");
                } else {
                    chrome.runtime.openOptionsPage();
                }
            }
        });
    }

    static createFixturesNotification() {
        chrome.notifications.create(CURRENT_FIXTURES_NOTIFICATION, {
            type: "basic",//"progress",
            iconUrl: getRandomNotificationIcon(),
            title: "Soccerify Updates",
            message: "Watch your favorite teams play football today.",
            requireInteraction: true,
            isClickable: false,
            //progress: 100,
            buttons: [{
                title: "Show Current Fixtures"
            },{
                title: "Change Preferences"
            }]
        }, function(notificationId) {
            console.log("Notification Displayed - " + notificationId);
        });
    }
}



export default BGUtility;
