import PouchDB from "pouchdb";



const DB = null;

class PouchDBService {

    static getInstance() {
        if (DB == null) {
            DB = new PouchDB("soccerify", {auto_compaction: true});
        }
    }

    static changeSeason() {

    }
}



export default PouchDBService;
