var http=require('http');
var url=require('url');
var fs = require('fs');

var CronJob = require('cron').CronJob;

var db = require('./database.js');
var scrap = require('./scrap.js');
var get = require('./get.js');

var debug = true;

/* RoboMongo Query for current status

var history=db.getCollection('history').find({});
var totalCompanies=db.getCollection('companies').find({}).length();
var totalHistory=history.length();
var updatables=db.getCollection('companies').find({"$or": [{historyUpdatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 *24)}},{historyUpdatedAt: null}]}).count();
var last100=db.getCollection('companies').find({ historyUpdatedAt: { $ne: null } }).limit(100).sort({historyUpdatedAt: 1});
var meanTime=((last100[99].historyUpdatedAt-last100[0].historyUpdatedAt)/60000)*60/100;
totalHistory+" de "+totalCompanies+ " (Global: "+Math.round(1000*totalHistory/totalCompanies)/10+"%) -> Actualizando "+(Math.round(10000-10000*(updatables/totalCompanies))/100)+"%. \nHora estimada finalización: "+new Date(new Date().getTime()+(totalCompanies-totalHistory)*1000*meanTime).toString();

*/

console.log("=>Services starting...");

db.connect(function(database){

    scrap.database=database;
    get.database=database;

    var server=http.createServer(function(req,res){
        var pathname=url.parse(req.url).pathname;
        res.returnCsv=function(filename, content){
            this.setHeader('Content-disposition', 'attachment; filename='+filename+'.csv');
            this.setHeader('Content-type', 'text/plain');
            this.end(content);
        }
        switch(pathname){
            //SCRAPs
            /*case '/scrap-data/get-companies-in-indexes':
                scrap.scrapCompaniesInIndexes(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap companies from index page"}));
                    debug && console.log("Finish scrapping companies in indexes");
                });
            break;
            case '/scrap-data/get-companies-in-indexes-paging':
                var params=url.parse(req.url, true).query;
                debug && console.log("Params: ",JSON.stringify(params));
                scrap.scrapCompaniesInIndexesPaging(params.index, params.page,function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap companies from index page #"}));
                    debug && console.log("Finish scrapping companies in indexes #");
                });
            break;
            case '/scrap-data/get-companies-info':
                scrap.scrapCompaniesInfo(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap companies info page"}));
                    debug && console.log("Finish scrapping companies info");
                });
            break;*/
            case '/scrap-data/get-companies-history':
                scrap.scrapCompaniesHistory(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap history from company page"}));
                    debug && console.log("Finish scrapping companies history");
                });
            break;
            case '/scrap-data/get-sectors':
                scrap.scrapSectors(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap sectors"}));
                    debug && console.log("Finish scrapping sectors");
                });
            break;
            case '/scrap-data/get-industries-in-sectors':
                scrap.scrapIndustriesInSectors(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap industries from sectors page"}));
                    debug && console.log("Finish scrapping industries");
                });
            break;
            case '/scrap-data/get-companies-in-industries':
                scrap.scrapCompaniesInIndustries(function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap companies from industries page"}));
                    debug && console.log("Finish scrapping companies in sector");
                });
            break;
            case '/scrap-data/get-companies-in-industries-paging':
                var params=url.parse(req.url, true).query;
                debug && console.log("Params: ",JSON.stringify(params));
                scrap.scrapCompaniesInIndustriesPaging(params.industryName,function(result){
                    res.end(JSON.stringify({"ok":result, "msg":"Scrap companies from industries page #"}));
                    debug && console.log("Finish scrapping companies in industries #");
                });
            break;

            //GETs
            case '/get-data/get-indexes':
                get.getIndexes(function(result, msg){
                    if(result){
                        res.returnCsv("indexes", msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted indexes");
                });
            break;
            case '/get-data/get-companies':
                get.getCompanies(function(result, msg){
                    if(result){
                        res.returnCsv("companies", msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted companies");
                });
            break;
            case '/get-data/get-directives':
                get.getDirectives(function(result, msg){
                    if(result){
                        res.returnCsv("directives", msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted directives");
                });
            break;
            case '/get-data/get-company-in-countries':
                get.getCompanyInCountries(function(result, msg){
                    if(result){
                        res.returnCsv("company-in-countries", msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted companies in countries");
                });
            break;
            case '/get-data/get-all-history':
                get.getHistories(function(result, msg){
                    if(result){
                        res.returnCsv("history-all", msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted histories");
                });
            break;
            case '/get-data/get-history-matrix':
                var params=url.parse(req.url, true).query;
                debug && console.log("Params: ",JSON.stringify(params));
                if(!params.offset){
                    var offset=0;
                }else{
                    var offset=parseInt(params.offset);
                }
                get.getHistoryMatrix(offset,function(repeat){
                    if(repeat){
                        console.log("Repeating");
                        http.get('http://localhost:8000/get-data/get-history-matrix?offset='+(offset+1), function(res){
                        }).on('error', function (error) {
                            console.log("Error in new scrap history matrix: "+error);
                        });
                        res.end("Working");
                    }else{
                        res.end("end");
                        debug && console.log("=>Finally end"); return;
                    }
                });
            break;
            case '/get-data/get-company-info':
                var params=url.parse(req.url, true).query;
                debug && console.log("Params: ",JSON.stringify(params));
                if(!params.symbol){
                    res.end(JSON.stringify({"ok":false, "msg":"Not symbol..."}));
                }
                get.getCompanyInfo(params.symbol, function(result, msg){
                    if(result){
                        res.returnCsv(params.symbol, msg);
                    }else{
                        res.end(msg);
                    }
                    debug && console.log("Getted companies history #");
                });
            break;
            default:
                fs.readFile('./main.html', function (err, html) {
                    if (err) {
                        throw err; 
                    }       
                    res.writeHeader(200, {"Content-Type": "text/html"});  
                    res.write(html);  
                    res.end();  
                });
            break;
            console.log("=>End request!");
        }

    }).listen(8000);

    console.log("=>Creating crons...");

    //Crons
    new CronJob({
        //Run on saturday
      cronTime: '00 00 18 * * 6',
      start: false,
      timeZone: 'Europe/Madrid',
      onTick: function() {
        //Runs on Saturday at night
        http.get('http://localhost:8000/scrap-data/get-companies-history', function(res){
        }).on('error', function (error) {
            console.log("Error in new scrap companies from indexes request (3): "+error);
        });
      }
    }).start();

    console.log("=>Services ready!");
});