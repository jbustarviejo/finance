var MongoClient = require('mongodb').MongoClient;

var debug=false;

module.exports = {
	connect: function (callback) {
		var database={};

		//Stablish connection with DataBase
		MongoClient.connect('mongodb://127.0.0.1:27017/finance', function(err, db) {
		    if(err){
		        console.log("=>ERROR while connecting database");
		        throw err;
		    }
		    console.log("=>Initialiting database and server...");


			database.getIndexToScrap=function(callback){
	        this.indexes.findOne({"$or": [{
	                updatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 * 24)}
	            }, {
	                updatedAt: null
	            }]}, function(err, doc){
	                if (doc){
	                    debug && console.log("Index found!...");
	                    callback && callback(doc);
	                }else{
	                    debug && console.log("No index found...");
	                    callback && callback(null);
	                }
	            }); 
	    	}
		    database.truncateCompaniesInIndex=function(indexToScrap, callback){
		        debug && console.log("Deleting companies in index.."+indexToScrap.indexId);
		        this.companies.remove({indexId: indexToScrap.indexId}, function(){
		            callback && callback(indexToScrap); return indexToScrap;
		        });
		    }
		    database.insertCompany=function(company){
		        company.createdAt=new Date();
		        debug && console.log("Se va a introducir compañía..."+JSON.stringify(company));
		        database.companies.insert(company);
		    }
		    database.updateIndex=function(indexToScrap, callback){
		        console.log("updating to"+JSON.stringify(indexToScrap));
		        this.indexes.update({indexId: indexToScrap.indexId},{$set:{updatedAt: new Date(), membersCount: indexToScrap.membersCount, indexId: indexToScrap.indexId, xid: indexToScrap.xid}}, function(err, doc){
		            if(err){
		                console.log("Error updating: "+err);
		            }
		            callback && callback();
		        });
		    }
		    database.getIndex=function(indexId, callback){
		        this.indexes.findOne({indexId: indexId}, function(err, doc){
		                if (doc){
		                    debug && console.log("Index (2) found!..."+JSON.stringify(doc));
		                    callback && callback(doc);
		                }else{
		                    debug && console.log("No index (2) found...");
		                    callback && callback(null);
		                }
		            }); 
		    }
		    database.getCompanyToScrap=function(callback){
		        this.companies.findOne(
		            {"$or": [{
		                updatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 * 24)}
		            }, {
		                updatedAt: null
		            }]}, function(err, doc){
		                if (doc){
		                    debug && console.log("Company found!..."+JSON.stringify(doc));
		                    callback && callback(doc);
		                }else{
		                    debug && console.log("No company found...");
		                    callback && callback(null);
		                }
		            }); 
		    }
		    database.updateCompany=function(company, callback){
		        this.companies.update({symbol: company.symbol},{$set:{
		            updatedAt: new Date(), 
		            sector: company.sector,
		            //subsector: company.subsector,
		           // marketCap: company.marketCap,
		           // currency: company.currency,
		            //averageVolume: company.averageVolume,
		            xid: company.xid
		            //directives: company.directives,
		            //countryList: company.countryList
		        }}, function(err, doc){
		            callback && callback();
		        });
		    }
		    database.getCompanyToScrapHistory=function(callback){
		        this.companies.findOne(
                       // {"$and": [
                            {"$or": [
                                {
                                    historyUpdatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 * 24 * 4)} //4 days
                                },{
                                    historyUpdatedAt: null
                                  }
                                ]
                         /*    }, {
                                symbol: /(FSI$|DJI$|NKIK$|HKG$|GER$)/
                            }
                          ]*/}, function(err, doc){
		                if (doc){
		                    debug && console.log("Company to scrap history found!...");
		                    callback && callback(doc);
		                }else{
		                    debug && console.log("No company to scrap history found...");
		                    callback && callback(null);
		                }
		            }); 
		    }
		    database.truncateCompanyHistory=function(company, callback){
		        debug && console.log("Deleting companies history..."+JSON.stringify(company.symbol));
		        this.history.remove({symbol: company.symbol}, function(){
		            callback && callback(company); return company;
		        });
		    }
		    database.insertCompanyHistory=function(history, callback){
		        this.history.insert(history, function(){
		            callback && callback(); return;
		        });
		    }
		    database.getCompanyHistory=function(symbol, callback){
		        this.history.findOne({symbol: symbol}, function(err, doc){
		            if (doc){
		                debug && console.log("Company history found!..."+doc.symbol);
		                callback && callback(doc);
		            }else{
		                debug && console.log("No company history found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.getHistoryForMatrix=function(offset, callback){
		        /*var cursor=this.history.find();
		        cursor.limit(1);
		        cursor.skip(offset);
		        cursor.sort({createdAt : 1});

		        cursor.toArray(function(err, docs){*/
		        this.history.find().limit(1).skip(offset).sort({createdAt : 1}).toArray(function(err, docs){
		        	console.log(err, docs);
			        if (docs && docs.length>0){
			            debug && console.log("Company 4 Matrix found!...");
			            callback && callback(docs[0]);
			        }else{
			            debug && console.log("No company 4 Matrix...");
			            callback && callback(null);
			        }
			    });
		    }
		    database.updateCompanyHistory=function(history, callback){
		        this.history.update({symbol: history.symbol},{$set:{
		            updatedAt: new Date(), 
		            entriesCount: history.entriesCount,
		            historicalValues: history.historicalValues,
		            xid: history.xid
		        }}, function(err, doc){
		            if(err){
		                console.log("Error updating: "+err);
		            }
		            callback && callback();
		        });
		    }
		    database.touchCompanyHistory=function(company, callback){
		        this.companies.update({symbol: company.symbol},{$set:{
		            historyUpdatedAt: new Date()
		        }}, function(err, doc){
		            if(err){
		                console.log("Error updating: "+err);
		            }
		            callback && callback(); return;
		        });
		    }
		    database.getCompany=function(symbol, callback){
		        this.companies.findOne({symbol: symbol}, function(err, doc){
		            if (doc){
		                debug && console.log("Company found!...");
		                callback && callback(doc);
		            }else{
		                debug && console.log("No company found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.getIndexes=function(callback){
		        this.indexes.find().toArray(function(err, docs){
		            if (docs){
		                debug && console.log("Indexes (3) found!...");
		                callback && callback(docs);
		            }else{
		                debug && console.log("No index (3) found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.getCompanies=function(callback){
		        this.companies.find().toArray(function(err, docs){
		            if (docs){
		                debug && console.log("Companies (3) found!...");
		                callback && callback(docs);
		            }else{
		                debug && console.log("No companies (3) found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.getHistories=function(callback){
		        this.history.find().toArray(function(err, docs){
		            if (docs){
		                debug && console.log("Histories (3) found!...");
		                callback && callback(docs);
		            }else{
		                debug && console.log("No histories (3) found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.insertSector=function(sector, callback){
		        this.sector.insert(sector, function(){
		            callback && callback(); return;
		        });
		    }
		    database.insertIndustry=function(industry, callback){
		        this.industry.insert(industry, function(){
		            callback && callback(); return;
		        });
		    }
		    database.truncateSectors=function(callback){
		        debug && console.log("Deleting sectors");
		        this.sector.remove({},function(){
		            callback && callback(true); return true;
		        });
		    }
		    database.truncateIndustriesInSector=function(sector, callback){
		        debug && console.log("Deleting sectors");
		        this.industry.remove({sector: sector.sectorName},function(){
		            callback && callback(sector); return sector;
		        });
		    }
		   	database.truncateCompaniesInIndustry=function(industry, callback){
		        debug && console.log("Deleting industries");
		        this.companies.remove({industry: industry.industryName},function(){
		            callback && callback(industry); return industry;
		        });
		    }
		    database.getSectorToScrap=function(callback){
	        this.sector.findOne({"$or": [{
	                updatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 * 24)}
	            }, {
	                updatedAt: null
	            }]}, function(err, doc){
	                if (doc){
	                    debug && console.log("Sector found!...");
	                    callback && callback(doc);
	                }else{
	                    debug && console.log("No sector found...");
	                    callback && callback(null);
	                }
	            }); 
	    	}
	    	database.getIndustryByName=function(industryName, callback){
		        this.industry.findOne({industryName: industryName},function(err, docs){
		            if (docs){
		                debug && console.log("Indsutr found!...");
		                callback && callback(docs);
		            }else{
		                debug && console.log("No industr found...");
		                callback && callback(null);
		            }
		        }); 
		    }
		    database.getIndustryBySlug=function(industrySlug, callback){
		        this.industry.findOne({slug: industrySlug},function(err, docs){
		            if (docs){
		                debug && console.log("Indsutr found!...");
		                callback && callback(docs);
		            }else{
		                debug && console.log("No industr found...");
		                callback && callback(null);
		            }
		        }); 
		    }
	    	database.getIndustryToScrap=function(callback){
	        this.industry.findOne({"$or": [{
	                updatedAt: {$lt:new Date(new Date().getTime() - (1000 * 60) * 60 * 24)}
	            }, {
	                updatedAt: null
	            }]}, function(err, doc){
	                if (doc){
	                    debug && console.log("industry found!...");
	                    callback && callback(doc);
	                }else{
	                    debug && console.log("No industry found...");
	                    callback && callback(null);
	                }
	            }); 
	    	}
	    	database.touchSector=function(sector, callback){
		        this.sector.update({sectorName: sector.sectorName},{$set:{
		            updatedAt: new Date()
		        }}, function(err, doc){
		            if(err){
		                console.log("Error updating: "+err);
		            }
		            callback && callback(); return;
		        });
		    }
		    database.touchIndustry=function(industry, callback){
		        this.industry.update({_id: industry._id},{$set:{
		            updatedAt: new Date(),
		            currentRow: industry.currentRow
		        }}, function(err, doc){
		            if(err){
		                console.log("Error updating: "+err);
		            }
		            callback && callback(); return;
		        });
		    }
		    database.indexes = db.collection('indexes',function(){
    			database.companies = db.collection('companies', function(){
    				database.history = db.collection('history', function(){
    					database.sector = db.collection('sector', function(){
    						database.industry = db.collection('industry', function(){
    	  						callback && callback(database); return;
	  						});
						});
    	  			});
				});
			});
	    });
	},
}	