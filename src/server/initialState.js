/* Attempt an initial state hack...? */
import { logajohn } from '../lib/logajohn'
import { config } from '../config'

import { Objectives } from './models/objectives'

let sWhere = "./src/server/initialState.js";

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)


function getInitialState(callback){

    const objectivesModel = new Objectives()

    // Later can 'remember' filters for client via cookies, if you'd like...
    let initialState = {"objectives_filters":{}};
    objectivesModel.getObjectives(initialState.objectives_filters)
    .then((objectives)=>{
      initialState.objectives_list = objectives; 
      callback(initialState);
    })
}

let initialState = {};

getInitialState((initialStateOut)=>{
    let sWho = `${sWhere}::getInitialState`;
    logajohn.debug(`${sWho}(): SHEMP: Moe, settin' initialState = `, initialStateOut );
    initialState = initialStateOut 
})

export default initialState;
