import PouchDB from "pouchdb";



let DB = null;

class PouchDBService {

    static getInstance() {
        if (DB == null) {
            DB = new PouchDB("soccerify", {auto_compaction: true});
        }
        return DB;
    }

    static changeSeason() {

    }
}



export default PouchDBService;
