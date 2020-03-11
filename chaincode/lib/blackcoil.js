/*
 * Soufiane Salama
 * Master's thesis: Black coil reception report
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BlackCoil extends Contract {

    blackCoil = {
        id,
        globalId,
        owner,
        productionDate,
        description,
        data: {
            surfaceInspection,
            upstream,
            supplyChain,
            coilingAspects,
            chemicalMeasurements
        }

    };

    async initLedger(ctx) {
        const fakeBlackCoils = [
           {
            id: 1,
            globalId: 125612,
            owner: 'Soufiane',
            productionDate: new Date,
            description: ''
           },
           {
            id: 2,
            globalId: 6182514,
            owner: 'Soufiane',
            productionDate: new Date,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae risus dapibus ligula scelerisque faucibus quis ac erat. Duis augue risus, malesuada ut dui eget, dapibus congue est. Maecenas faucibus augue quam, non placerat dui congue vel. Mauris efficitur nisi vel ante porttitor interdum'
           },
           {
            id: 3,
            globalId: 318562,
            owner: 'SALAMA',
            productionDate: new Date,
            description: '',
            data: {
                surfaceInspection: 
                    [
                        "uspendisse aliquam est enim, ",
                        "test"
                    ]
                ,
                upstream: [
                    "non tempus felis vestibulum ullamcorper. "
                ]
            }
           }
        ];

        for (let i = 0; i < fakeBlackCoils.length; i++) {
            await ctx.stub.putState(i, Buffer.from(JSON.stringify(fakeBlackCoils[i])));
            console.info('Added Black Coil: ', fakeBlackCoils[i]);
        }

    }

    async createBlackCoil (ctx, globalId, owner, description){
        console.info("Creating new black coil")

        // Get last id number
        // Or just use the globalId as unique identifier instead of incrementing the id
        
        // Get UNIX timestamp or date
        dateObj = new Date;
        
        // Creating the object
        this.blackCoil = {
            id: 0,
            globalId: globalId,
            owner: owner,
            description: description,
            productionDate: dateObj,
            data: {
                surfaceInspection:'',
                upstream:'',
                supplyChain:'',
                coilingAspects:'',
                chemicalMeasurements:''
            }
        };
        // Adding the object to the world state (CouchDB)
        // Key-Value DB
        // GlobalId - BlackCoil object(JSON format)
        // Stub = World state data API (getState, putState, deleteState, ...)
        await ctx.stub.putState(globalId, Buffer.from(JSON.stringify(this.blackCoil)));
        
        console.info("End creating new black coil");
        
    }

    async updateBlackCoilData(ctx, dataKey, globalId, owner, data){
        // No function for updating
        // So, first fetching, then update the fetched object, lastly upload with putState

        // 1. Fetching the object from the World State
        blackCoilAsBytes = await ctx.stub.getState(globalId);
        if (!blackCoilAsBytes || blackCoilAsBytes.length === 0) {
            throw new Error(`Black Coil with id "${globalId}" does not exist`);
        }

        const blackCoilFetched = JSON.parse(blackCoilAsBytes.toString());
 
        
        // 2.Update the fetched object
        switch (dataKey) {
            case 1:
                // Key 1: Surface Inspection data
                blackCoilFetched.data.surfaceInspection = data;
                break;
            case 2:
                // Key 2: Upstream process data
                blackCoilFetched.data.upstream = data;
                break;
            case 3:
                // Key 3: Supply Chain data
                blackCoilFetched.data.supplyChain = data;
                break;
            case 4:
                // Key 4: Coiling Aspects;
                blackCoilFetched.data.coilingAspects = data;
                break;

            case 5:
                // Key 5: Chemical Measurments;
                blackCoilFetched.data.chemicalMeasurements = data;
                break;
        
            default:
                break;
        }
        blackCoilFetched.owner = owner;

        // 3.Upload the updatet object
        await ctx.stub.putState(globalId, Buffer.from(JSON.stringify(blackCoilFetched)));
    }

    async queryBlackCoil(ctx, globalId){
        blackCoilAsBytes = await ctx.stub.getState(globalId);
        if (!blackCoilAsBytes || blackCoilAsBytes.length === 0) {
            throw new Error(`Black Coil with id "${globalId}" does not exist`);
        }
        //console.log(blackCoilAsBytes.toString());
        return blackCoilAsBytes.toString();
    }

    async changeOwnerBlackCoil(ctx, globalId, newOwner) {
        blackCoilAsBytes = await ctx.stub.getState(globalId);
        if (!blackCoilAsBytes || blackCoilAsBytes.length === 0) {
            throw new Error(`Black Coil with id "${globalId}" does not exist`);
        }

        const blackCoilFetched = JSON.parse(blackCoilAsBytes.toString());
        blackCoilFetched.owner = newOwner;

        await ctx.stub.putState(globalId, Buffer.from(JSON.stringify(blackCoilFetched)));
    }

}

module.exports = BlackCoil;
