/*
 * Soufiane Salama
 * Master's thesis: Track coil scrap
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ScrapTracking extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        var scraplist = [];
        var containerlist = [];
        let scrap = {};
        let container = {};
        let scrapbox = {};

        scrap = {};
        scrap.scrapid = 'SCRAP0';
        scrap.docType='scrap';
        scrap.type='coil_waste';
        scrap.mothercoil='XDS5213';
        scrap.description='this scrap is from a damaged coil';
        scrap.location='servicecenter';
        scrap.owner = 'service_center_gnk';
        await ctx.stub.putState(scrap.scrapid, Buffer.from(JSON.stringify(scrap)));

        scraplist.push(scrap);

        scrap = {};
        scrap.scrapid = 'SCRAP1';
        scrap.docType='scrap';
        scrap.type='recycled_materials';
        scrap.mothercoil='';
        scrap.description='this scrap is from recycled materials';
        scrap.location='scrap_yard';
        scrap.owner = 'scrap_yard_gnk';
        await ctx.stub.putState(scrap.scrapid, Buffer.from(JSON.stringify(scrap)));

        scraplist.push(scrap);

        container = {};
        container.containerid = 'CONTAINER0';
        container.containeridlocal = 'CONTAINER_XS584';
        container.docType='container';
        container.description='this container is located at the service center in GNK';
        container.location='servicecenter';
        container.owner = 'servicecenter_gnk';
        container.scraplist = scraplist;
        await ctx.stub.putState(container.containerid, Buffer.from(JSON.stringify(container)));

        containerlist.push(container);

        container = {};
        container.containerid = 'CONTAINER1';
        container.containeridlocal = 'CONTAINER_M584';
        container.docType='container';
        container.description='this container is located at the service center in X';
        container.location='servicecenter';
        container.owner = 'servicecenter_X';
        container.scraplist = [];
        await ctx.stub.putState(container.containerid, Buffer.from(JSON.stringify(container)));

        containerlist.push(container);

        scrapbox = {};
        scrapbox.scrapboxid = 'SCRAPBOX0';
        scrapbox.scrapboxidlocal = 'SCRAPBOX_L3';
        scrapbox.docType='scrapbox';
        scrapbox.description='this scrapbox is located at the scrap yard in GNK';
        scrapbox.location='scrap_yard';
        scrapbox.owner = 'meltshop_gnk';
        scrapbox.containerlist = containerlist
        await ctx.stub.putState(scrapbox.scrapboxid, Buffer.from(JSON.stringify(scrapbox)));

    }

}
module.exports = ScrapTracking;
