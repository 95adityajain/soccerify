static class LocalStorageService {
    
    static get(propName) {
        return JSON.parse(localStorage.getItem(propName));
    }

    static set(propName, propValue) {
        localStorage.setItem(propName, JSON.stringify(propValue));
    }

    static remove(propName) {
        localStorage.removeItem (propName);
    }
}



export default LocalStorageService;
