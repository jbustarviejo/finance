var http = require('http');
var env = require('jsdom').env;
var debug = true;
var delay=1;
var maximunYearToScrap=2009;

module.exports = {
	/*scrapCompaniesInIndexes: function (callback) {
		var self=this;
		self.scrapCompaniesInIndexesFromFinantialTimes(function(repeat){
			if(repeat){
				//Make another asynch request, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-indexes', function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from indexes request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else{
				//End scrapping companies in indexes
				//TODO: call scrapCompaniesInfo
				debug && console.log("====>Finally indexes end!!");
			}
			callback && callback(repeat); return;
		});
	},
	scrapCompaniesInIndexesPaging: function (index, page, callback) {
		var self=this;
		self.scrapCompaniesInIndexesFromFinantialTimesPage(index, page,function(repeat, url){
			if(repeat){
				debug && console.log("----Calling again to scrap page");
				setTimeout(function() {
					http.get(url, function(res){
				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from indexes request (3): "+error);
					});
				}, delay);
			}else{
				debug && console.log("----End this index!!");
				//Make another asynch request to get new index
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-indexes', function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from indexes request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}
			callback && callback(repeat); return;
		});
	},
	scrapCompaniesInfo: function (callback) {
		var self=this;
		self.scrapCompaniesInfoFromFinantialTimes(function(repeat){
			if(repeat){
				//Make another asynch request, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
	    			http.get('http://localhost:'+self.port+'/scrap-data/get-companies-info', function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies info request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else{
				debug && console.log("====>Finally company end!!");
				//Finish of scraping companies info
				//TODO: Call to scrap companies history
			}
			callback && callback(repeat); return;
		});
	},*/
	scrapSectors: function (callback) {
		var self=this;
		self.scrapSectorsFromFinantialTimes(function(repeat){
			debug && console.log("====>Finally sectors end!!");
			callback && callback(repeat); return;
		});
	},
	scrapIndustriesInSectors: function (callback) {
		var self=this;
		self.scrapIndustriesInSectorsFromFinantialTimes(function(continueScrap){
			if(continueScrap){
				debug && console.log("----End this sector");
				//Make another asynch request to get new index
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-industries-in-sectors', function(res){
				  	}).on('error', function (error) {
						console.log("Error in new scrap industries from sectors request: "+error);
					    callback && callback(repeat); return;
					});
				}, randomDelay);
			}else{
				debug && console.log("====>Finally industries end!!");
			}
			callback && callback(continueScrap); return;
		});
	},
	scrapCompaniesInIndustries: function (callback) {
		var self=this;
		self.scrapCompaniesInIndustriesFromFinantialTimes(function(continueScrap,industryName){
			if(continueScrap==1){
				//Make another asynch request to this function, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-industries', function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from industries request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else if(continueScrap==2){
				//Make another asynch request, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-industries-paging?industryName='+encodeURI(industryName), function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from industries request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else{
				//End scrapping companies in indexes
				//TODO: call scrapCompaniesInfo
				debug && console.log("====>Finally indexes end!!");
			}
			callback && callback(continueScrap); return;
		});
	},
	scrapCompaniesInIndustriesPaging: function (industryName,callback) {
		var self=this;
		self.scrapCompaniesInIndustriesFromFinantialTimesPaging(industryName,function(continueScrap,industryName){
			if(continueScrap==1){
				//Make another asynch request to previous function, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-industries', function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from industries request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else if(continueScrap==2){
				//Make another asynch request, with a delay
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-industries-paging?industryName='+encodeURI(industryName), function(res){

				  	}).on('error', function (error) {
						console.log("Error in new scrap companies from industries request: "+error);
					    callback && callback(false);
					});
				}, randomDelay);
			}else{
				//End scrapping companies in indexes
				//TODO: call scrapCompaniesInfo
				debug && console.log("====>Finally indexes end!!",continueScrap);
			}
			callback && callback(continueScrap); return;
		});
	},
	scrapCompaniesHistory: function (callback) {
		var self=this;
		self.scrapCompaniesHistoryFromFinantialTimes(function(repeat){
			if(repeat){
				debug && console.log("Request new paging");
				var randomDelay = Math.round(Math.random()*delay) + delay;
				setTimeout(function() {
					http.get('http://localhost:'+self.port+'/scrap-data/get-companies-history', function(res){
				  	}).on('error', function (error) {
						console.log("Error in new scrap companies fhistory: "+error);
					});
					callback && callback(repeat); return;
				}, randomDelay);
				callback && callback(repeat); return;
			}else{
				//Finally End!!
				debug && console.log("====>Finally history end!!");
				callback && callback(repeat); return;
			}
		});
	},
	scrapCurrencies: function (callback) {
		var self=this;
		var currencies=["HKD","EUR","SGD","GBp","AUD","INR","CAD","JPY","PKR","MYR","IDR","TWD","CNY","CLP","PLN","PHP","SEK","LKR","TRY","THB","CHF","CZK","KES","BRL","DKK","MAD","NZD","ARS","NOK","RUB","MXN","HUF","NGN","OMR","VND","ZAc"];
		var symbolsEq=[616890, 613522, 611926, 618593, 615091, 613630, 615897, 616660, 611329, 617993, 620107, 612220, 612178, 613406,614165,617570,616203,611754,606737,619310,610693,617503,615961,615261,610928,618362,615812,616173,617514,614073,617606,617039,614035,615719,611986,610789];

		self.database.truncateCurrencies(function(){
			for(var i=0; i<currencies.length;i++){
				self.scrapCurrencyToUSD(currencies[i], symbolsEq[i]); 
			}
			debug && console.log("====>Finally history end!!");
			callback(true);
		});
	},

	/*
	* Get companies in indexes from FT
	
	scrapCompaniesInIndexesFromFinantialTimes:function(callback){
		var self=this;
		self.database.getIndexToScrap(function(indexToScrap){
			if(!indexToScrap){
				callback && callback(false); return;
			}
			self.database.truncateCompaniesInIndex(indexToScrap, function(indexToScrap){
				debug && console.log("truncated table. looking for index"+indexToScrap.indexId);

				debug && console.log("Processing request: http://markets.ft.com/data/indices/tearsheet/constituents?s="+indexToScrap.indexId);
				http.get("http://markets.ft.com/data/indices/tearsheet/constituents?s="+indexToScrap.indexId, function(res){
					var html = '';
					debug && console.log('Response is '+res.statusCode);

					res.on('data', function (chunk) {
						debug && console.log("Loading...");
					    html += chunk;
					});

					res.on('end', function () {
						env(html, function (errors, window) {
							var $ = require('jquery')(window);

							var companyNames=$(".mod-ui-table__cell--text .mod-ui-link");
							var symbols=$(".mod-ui-table__cell--text .mod-ui-table__cell__subtext");
							var xid=$("[data-mod-xid]").attr("data-mod-xid");

							console.log(JSON.stringify(companyNames));

							indexToScrap.xid=xid;

							var membersCount=0;

							var size = companyNames.length;
						
							if(size>0){
								for(var i=0;i<companyNames.length;i++){
									var company={};
									membersCount++
									company.name=$(companyNames[i]).text();
									company.symbol=$(symbols[i]).text();
									company.indexId=indexToScrap.indexId;
									self.database.insertCompany(company);
								}
							}else{
								callback && callback(true); return true;
							}

							indexToScrap.membersCount=membersCount;

							self.database.updateIndex(indexToScrap, function(){
								http.get('http://localhost:'+self.port+'/scrap-data/get-companies-in-indexes-paging?page=2&index='+indexToScrap.indexId, function(res){
							  	}).on('error', function (error) {
									console.log("Error in new scrap companies from indexes request (2): "+error);
								});
								callback && callback(false);return false;
							});
						});
					});
			  	}).on('error', function (error) {
					console.log("Request error in http to index '"+indexToScrap.index+"': "+error);
				    callback && callback(false); return;
				});
			});
		});
	},*/
	/*
	* Get companies in indexes from FT, starting in page #
	
	scrapCompaniesInIndexesFromFinantialTimesPage:function(indexId, page, callback){
		var self=this;
		self.database.getIndex(indexId, function(indexToScrap){
			if(!indexToScrap){
				callback && callback(false); return;
			}

			debug && console.log("Processing request...");
			console.log("http://markets.ft.com/data/indices/ajax/getindexconstituents?xid="+indexToScrap.xid+"&pagenum="+page);
			
			http.get("http://markets.ft.com/data/indices/ajax/getindexconstituents?xid="+indexToScrap.xid+"&pagenum="+page, function(res){
				var html = '';
				debug && console.log('Response is '+res.statusCode);

				res.on('data', function (chunk) {
					debug && console.log("Loading...");
				    html += chunk;
				});

				res.on('end', function () {
					
					var response = JSON.parse(html);
					env(response.html, function (errors, window) {
						var $ = require('jquery')(window);
						
						var companyNames=$(".mod-ui-table__cell--text .mod-ui-link");
						var symbols=$(".mod-ui-table__cell--text .mod-ui-table__cell__subtext");

						var membersCount=0;

						if(indexToScrap.membersCount!=null){
							membersCount=indexToScrap.membersCount;
						}

						var size = companyNames.length;
						
						if(size>0){
							for(var i=0;i<size;i++){
								var company={};
								membersCount++
								company.name=$(companyNames[i]).text();
								company.symbol=$(symbols[i]).text();
								company.indexId=indexToScrap.indexId;
								self.database.insertCompany(company);
							}
						}else{
							callback && callback(false); return false;
						}

						indexToScrap.membersCount=membersCount;

						self.database.updateIndex(indexToScrap, function(){
							callback && callback(true, 'http://localhost:'+self.port+'/scrap-data/get-companies-in-indexes-paging?page='+(page*1+1)+'&index='+indexToScrap.indexId); return true;
						});
					});
				});
		  	}).on('error', function (error) {
				console.log("Request error in http to index '"+indexToScrap.index+"': "+error);
			    callback && callback(false); return falase;
			});
		});
	},*/
	/*
	* Get companies info
	*
	scrapCompaniesInfoFromFinantialTimes:function(callback){
		var self=this;

		self.database.getCompanyToScrap(function(company){
			if(!company){
				callback && callback(false); return;
			}

			debug && console.log("Processing request...");
		
			http.get("http://markets.ft.com/data/equities/tearsheet/summary?s="+company.symbol, function(res){
				var html = '';
				debug && console.log('Response is '+res.statusCode);

				res.on('data', function (chunk) {
					debug && console.log("Loading...");
				    html += chunk;
				});

				res.on('end', function () {

					if(res.statusCode!=200){
						var location = res.headers['location'];
						console.log(location);
						debug && console.log("STOP ACTION: Code "+res.statusCode);


						http.get("http://markets.ft.com/data/investment-trust/tearsheet/summary?s="+company.symbol, function(res){
							var html = '';
							debug && console.log('Response is '+res.statusCode);

							res.on('data', function (chunk) {
								debug && console.log("Loading...");
							    html += chunk;
							});

							res.on('end', function () {

								if(res.statusCode!=200){
									var location = res.headers['location']
									console.log(location);
									debug && console.log("STOP ACTION: Code "+res.statusCode);
									callback && callback(false); return false; //Try to continue...? 
								}

								env(html, function (errors, window) {
									var $ = require('jquery')(window);
									
									var sectorSubsector=$(".mod-tearsheet-overview__esi").html();

									if(sectorSubsector!=null){
										company.sector=sectorSubsector.substr(0,sectorSubsector.indexOf("<i "));
										company.subsector=sectorSubsector.substr(sectorSubsector.indexOf("/i>")+3,sectorSubsector.length);
									}else{
										company.sector=null;
										company.subsector=null;
									}

									var marketCapTag=$($(".mod-tearsheet-key-stats__data__table:first tr")[1]).find("td");
									var marketCapHtml=marketCapTag.html();
									company.marketCap=marketCapHtml.substr(0,marketCapHtml.indexOf(" <span"));
									company.currency=marketCapTag.find("span").text();

									company.xid=JSON.parse($(".mod-tearsheet-add-to-portfolio").attr("data-mod-config")).xid;

									//company.averageVolume=$(".mod-tearsheet-key-stats__extra .mod-ui-table").first().find("td").first().text();

									debug && console.log("Result: "+JSON.stringify(company));
									self.database.updateCompany(company, function(){
										callback && callback(true); return true;
									});
								});
							});
					  	}).on('error', function (error) {
							console.log("Request error in http to company '"+company.bloombergId+"': "+error);
						    callback && callback(false); return;
						});



						callback && callback(false); return false; //Try to continue...? 
					}

					env(html, function (errors, window) {
						var $ = require('jquery')(window);
						
						var sectorSubsector=$(".mod-tearsheet-overview__esi").html();

						if(sectorSubsector!=null){
							company.sector=sectorSubsector.substr(0,sectorSubsector.indexOf("<i "));
							company.subsector=sectorSubsector.substr(sectorSubsector.indexOf("/i>")+3,sectorSubsector.length);
						}else{
							company.sector=null;
							company.subsector=null;
						}

						/*var directives={};
						var $directives=$(".mod-tearsheet-ircms-widgets__widget__content--slideshow>span");
						for(var i=0; i<$directives.length;i++){
							var fullDirective=$($directives[i]).find("p").text().split(", ");
							var directive={};
							directive.name=fullDirective[0];
							directive.title=fullDirective[1];
							directives[i]=directive;
						}
						company.directives=directives;*/

						/*var $countryList=$(".mod-ui-symbol-chain li");
						var countryList={};
						var currentCountry=$($countryList[0]).text();
						var currentCountryList={};
						var k=0;

						for(var j=1; j<$countryList.length; j++){
						  var $countryEntry=$($countryList[j]);
						  if($countryEntry.hasClass("mod-ui-symbol-chain__country")){
						    
						    countryList[currentCountry]=currentCountryList;
						    k=0;
						    currentCountry=$countryEntry.text();
						    currentCountryList={};
						  }else{
						    var span=$countryEntry.find("span");
						    currentCountryList[k++]={"symbol":span.first().text(), "market":span.last().text()};
						  }
						}

						company.countryList=countryList;*//*

						var marketCapTag=$("[data-lexicon-term='market capitalisation']").parent().siblings("td");
						var marketCapHtml=marketCapTag.html();
						company.marketCap=marketCapHtml.substr(0,marketCapHtml.indexOf(" <span"));
						company.currency=marketCapTag.find("span").text();

						company.xid=JSON.parse($(".mod-tearsheet-add-to-portfolio").attr("data-mod-config")).xid;

						//company.averageVolume=$(".mod-tearsheet-key-stats__extra .mod-ui-table").first().find("td").first().text();

						debug && console.log("Result: "+JSON.stringify(company));
						self.database.updateCompany(company, function(){
							callback && callback(true); return true;
						});
					});
				});
		  	}).on('error', function (error) {
				console.log("Request error in http to company '"+company.bloombergId+"': "+error);
			    callback && callback(false); return;
			});
		});
	},*/
	/*
	* Get companies sectors
	*/
	scrapSectorsFromFinantialTimes:function(callback){
		var self=this;

		self.database.truncateSectors(function(company){
			if(!company){
				callback && callback(false); return;
			}

			debug && console.log("Processing request...");
		
			http.get("http://markets.ft.com/research/Markets/Sectors-and-industries", function(res){
				var html = '';
				debug && console.log('Response is '+res.statusCode);

				res.on('data', function (chunk) {
					debug && console.log("Loading...");
				    html += chunk;
				});

				res.on('end', function () {

					if(res.statusCode!=200){
						var location = res.headers['location'];
						console.log(location);
						debug && console.log("STOP ACTION: Code "+res.statusCode);
						callback && callback(false); return false; //Try to continue...? 
					}

					env(html, function (errors, window) {
						var $ = require('jquery')(window);
						
						var allSectors=$(".outerTable tr.accordianControl");
						
						for(var i=0; i<allSectors.length;i++){
							var thisSectorHTML=$(allSectors[i]).find("td");
							var sectorName=$(thisSectorHTML[1]).text();
							var industriesNumber=parseInt($(thisSectorHTML[2]).text());
							var companiesNumber=parseInt($(thisSectorHTML[3]).text().replace(",",""));
							var slug=sectorName.replaceAll(" ","-").replaceAll("&","and");
							self.database.insertSector({sectorName, industriesNumber, companiesNumber, slug, createdAt: new Date()});
						}
						
						callback && callback(true); return true;
					});
				});
		  	}).on('error', function (error) {
				console.log("Request error in http to sector: "+error);
			    callback && callback(false); return;
			});
		});
	},
	/*
	* Get industries from FT
	*/
	scrapIndustriesInSectorsFromFinantialTimes:function(callback){
		var self=this;
		self.database.getSectorToScrap(function(sectorToScrap){
			if(!sectorToScrap){
				callback && callback(false); return false;
			}
			self.database.truncateIndustriesInSector(sectorToScrap, function(sectorToScrap){
				http.get("http://markets.ft.com/research/Browse-Companies/"+sectorToScrap.slug, function(res){
					var html = '';
					debug && console.log('Response is '+res.statusCode);

					res.on('data', function (chunk) {
						debug && console.log("Loading...");
					    html += chunk;
					});

					res.on('end', function () {
						env(html, function (errors, window) {
							var $ = require('jquery')(window);

							var industries=$(".simpleLinkList.wsodModuleContent li a");
							for(var i=0;i<industries.length;i++){
								var industry={};
								var industryName=$(industries[i]).text();
								industry.industryName=industryName;
								industry.url=$(industries[i]).attr("href");
								industry.sector=sectorToScrap.sectorName;
								industry.slug=industryName.replaceAll(" ","-").replaceAll("&","and");
								industry.createdAt=new Date();
								self.database.insertIndustry(industry);
								console.log("A guardar...",industry);
							}
					
							self.database.touchSector(sectorToScrap, function(){
								callback && callback(true);return true;
							});
						});
					});
			  	}).on('error', function (error) {
					console.log("Request error in http to index '"+indexToScrap.index+"': "+error);
				    callback && callback(false); return false;
				});
			});
		});
	},
	/*
	* Get companies from FT
	*/
	scrapCompaniesInIndustriesFromFinantialTimes:function(callback){
		var self=this;
		self.database.getIndustryToScrap(function(industryToScrap){
			if(!industryToScrap){
				callback && callback(false); return false;
			}
			self.database.truncateCompaniesInIndustry(industryToScrap, function(industryToScrap){
				industryToScrap.currentRow=0;
				console.log("http://markets.ft.com/Research/Remote/UK/BrowseCompanies/UpdateCompanyList?RowsPerPage=100&startRow="+industryToScrap.currentRow+"&industry="+industryToScrap.industryName);
				http.get("http://markets.ft.com/Research/Remote/UK/BrowseCompanies/UpdateCompanyList?RowsPerPage=100&startRow="+industryToScrap.currentRow+"&industry="+industryToScrap.industryName.replaceAll("&","%26"), function(res){
					var html = '';
					debug && console.log('Response is '+res.statusCode);

					res.on('data', function (chunk) {
						debug && console.log("Loading...");
					    html += chunk;
					});

					res.on('end', function () {
						var parsedJson=JSON.parse(html);
						var totalRows=parsedJson.json.paging.totalRows;
						var parsedHtml=parsedJson.html;
						console.log("HTML>>",parsedHtml);
						env(parsedHtml, function (errors, window) {
							var $ = require('jquery')(window);

							var hrefs=$("a");
							if(hrefs.length==0){
								console.log(hrefs);
								self.database.touchIndustry(industryToScrap, function(){
									callback && callback(1);return 1;
								});
							}else{
								for(var i=0;i<hrefs.length;i++){
									var company={};
									company.companyName=$(hrefs[i]).text();
									company.url=$(hrefs[i]).attr("href")
									company.symbol=company.url.substring(company.url.indexOf("?s=")+3,company.url.length)
									company.sector=industryToScrap.sector;
									company.industry=industryToScrap.industryName;
									company.createdAt=new Date();
									self.database.insertCompany(company);
									console.log("A guardar...",company);
								}
						
								self.database.touchIndustry(industryToScrap, function(){
									callback && callback(2, industryToScrap.slug);return 2;
								});
							}
						});
					});
			  	}).on('error', function (error) {
					console.log("Request error in http to index '"+industryToScrap.industryName+"': "+error);
				    callback && callback(false); return false;
				});
			});
		});
	},
	/*
	* Get companies from FT
	*/
	scrapCompaniesInIndustriesFromFinantialTimesPaging:function(industryName, callback){
		var self=this;
		self.database.getIndustryBySlug(industryName, function(industryToScrap){
			if(!industryToScrap){
				callback && callback(false); return false;
			}
			console.log("1=>",industryToScrap);
			industryToScrap.currentRow=industryToScrap.currentRow+100;
			console.log("2=>",industryToScrap);
			http.get("http://markets.ft.com/Research/Remote/UK/BrowseCompanies/UpdateCompanyList?RowsPerPage=100&startRow="+(industryToScrap.currentRow+1)+"&industry="+industryToScrap.industryName.replaceAll("&","%26"), function(res){
				var html = '';
				debug && console.log('Response is '+res.statusCode);

				res.on('data', function (chunk) {
					debug && console.log("Loading...");
				    html += chunk;
				});

				res.on('end', function () {
					var parsedJson=JSON.parse(html);
					var totalRows=parsedJson.json.paging.totalRows;
					var parsedHtml=parsedJson.html;
					env(parsedHtml, function (errors, window) {
						var $ = require('jquery')(window);

						var hrefs=$("a");
						if(hrefs.length==0){
							self.database.touchIndustry(industryToScrap, function(){
								callback && callback(1);return 1;
							});
						}else{
							for(var i=0;i<hrefs.length;i++){
								var company={};
								company.companyName=$(hrefs[i]).text();
								company.url=$(hrefs[i]).attr("href");
								company.symbol=company.url.substring(company.url.indexOf("?s=")+3,company.url.length);
								company.sector=industryToScrap.sector;
								company.industry=industryToScrap.industryName;
								company.createdAt=new Date();
								self.database.insertCompany(company);
								console.log("A guardar...",company);
							}
					
							self.database.touchIndustry(industryToScrap, function(){
								callback && callback(2,industryToScrap.slug);return 2;
							});
						}
					});
				});
		  	}).on('error', function (error) {
				console.log("Request error in http to index '"+industryToScrap.industryName+"': "+error);
			    callback && callback(false); return false;
			});
		});
	},
	/*
	* Get currencies from FT
	*/
	scrapCurrencyToUSD:function(currency, xid){
		var self=this;

		var body = JSON.stringify({"days":3700,"dataNormalized":false,"dataPeriod":"Month","dataInterval":1,"endOffsetDays":0,"exchangeOffset"
		:0,"realtime":false,"yFormat":"0.###","timeServiceFormat":"JSON","rulerIntradayStart":26,"rulerIntradayStop"
		:3,"rulerInterdayStart":10957,"rulerInterdayStop":365,"returnDateType":"ISO8601","elements":[{"Label"
		:"67cc78e9","Type":"price","Symbol":xid,"OverlayIndicators":[],"Params":{}}]});

		var request = new http.ClientRequest({
		    hostname: "markets.ft.com",
		    port: 80,
		    path: "/data/chartapi/series",
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json",
		        "Content-Length": Buffer.byteLength(body)
		    }
		})

		request.end(body)
		request.on('response', function (response) {
			var html="";

		  //response.setEncoding('utf8');

		response.on('data', function (chunk) {
		    html+=chunk;
		});

		response.on('end', function (chunk) {
			try{
		    	var allResponse=JSON.parse(html);
		    }catch(Exception){
		    	return;
		    }

		    var dates=allResponse.Dates;

		    var curr={};
		    var historicalValues={};
		    var datesLength=0;

		    if(allResponse.Elements && allResponse.Elements[0] && allResponse.Elements[0].ComponentSeries && allResponse.Elements[0].ComponentSeries[0] && allResponse.Elements[0].ComponentSeries[0].Values){
		    	var open=allResponse.Elements[0].ComponentSeries[0].Values; //All other data are available too (close, volumne...)

			    for(var i=0; i<dates.length; i++){
			      historicalValues[dates[i]]=open[i];
			    }
			    datesLength=dates.length;
		    }

		    curr.symbol=currency
		    curr.xid=xid
		    curr.currencyName=allResponse.Elements[0].CompanyName;
		    curr.historicalValues=historicalValues;
		    curr.createdAt=new Date();
		    curr.entriesCount=datesLength;
		    
		    self.database.insertCurrency(curr, function(){
				return;
			});
		  });
		}).on('error', function (error) {
			console.log("Request error in http to currency '"+currency+"': "+error);
			return;
		});
	},
	/*
	* Get companies history
	*/
	scrapCompaniesHistoryFromFinantialTimes:function(callback){
		var self=this;
		
		self.database.getCompanyToScrapHistory(function(company){
			if(!company){
				callback && callback(false); return;
			}
			self.database.truncateCompanyHistory(company, function(companyToScrap){

				function getHistory(company, callback){
					debug && console.log("Processing request...");

					var body = JSON.stringify({"days":3650,"dataNormalized":false,"dataPeriod":"Day","dataInterval":1,"endOffsetDays":0,"exchangeOffset"
					:0,"realtime":false,"yFormat":"0.###","timeServiceFormat":"JSON","rulerIntradayStart":26,"rulerIntradayStop"
					:3,"rulerInterdayStart":10957,"rulerInterdayStop":365,"returnDateType":"ISO8601","elements":[{"Label"
					:"46bd1516","Type":"price","Symbol":company.xid,"OverlayIndicators":[],"Params":{}}]});

					var request = new http.ClientRequest({
					    hostname: "markets.ft.com",
					    port: 80,
					    path: "/data/chartapi/series",
					    method: "POST",
					    headers: {
					        "Content-Type": "application/json",
					        "Content-Length": Buffer.byteLength(body)
					    }
					})

					request.end(body)
					request.on('response', function (response) {
						var html="";

					  //response.setEncoding('utf8');

					response.on('data', function (chunk) {
					    html+=chunk;
					});

					response.on('end', function (chunk) {
						try{
					    	var allResponse=JSON.parse(html);
					    }catch(Exception){
					    	callback && callback(false); return false;
					    }

					    var dates=allResponse.Dates;
					    var history={};
						var historicalValues={};
						var datesLength=0;
						var currency=null;

					    if(allResponse.Elements && allResponse.Elements[0] && allResponse.Elements[0].ComponentSeries && allResponse.Elements[0].ComponentSeries[0] && allResponse.Elements[0].ComponentSeries[0].Values){
					    	var open=allResponse.Elements[0].ComponentSeries[0].Values; //All other data are available too (close, volumne...)
						    var currency=allResponse.Elements[0].Currency

						    for(var i=0; i<dates.length; i++){
						      historicalValues[dates[i]]=open[i];
						    } 
						    datesLength=dates.length;
					    }

					    history.symbol=company.symbol;
					    //history.sector=company.sector;
					    //history.industry=company.industry;
					    //history.companyName=company.companyName;
					    history.historicalValues=historicalValues;
					    history.currency=currency;
					    history.createdAt=new Date();
					    history.entriesCount=datesLength;
					    
					    self.database.insertCompanyHistoryWithUpdate(history, function(){
							self.database.touchCompanyHistory(company, function(){
								debug && console.log("Scrap other ("+company.symbol+")");
								callback && callback(true); return true;
							});
						});
					  });
					}).on('error', function (error) {
						console.log("Request error in http to symbol '"+company.symbol+"': "+error);
					    callback && callback(false); return false;
					});
				}

				//if(!companyToScrap.xid){
					self.getCompanyXidAndVolume(companyToScrap, function(result){
						if(!result){
							callback && callback(false); return;
						}
						getHistory(companyToScrap,callback);
					});
				/*}else{
					getHistory(companyToScrap,callback);
				}*/
			});
		});
	},
	getCompanyXidAndVolume: function(company, callback){
		var self=this;
		http.get("http://markets.ft.com/data/equities/tearsheet/summary?s="+company.symbol, function(res){
			var html = '';
			debug && console.log('Response is '+res.statusCode);

			res.on('data', function (chunk) {
				debug && console.log("Loading...");
			    html += chunk;
			});

			res.on('end', function () {

				if(res.statusCode!=200){
					var location = res.headers['location'];
					console.log(location);
					debug && console.log("STOP ACTION: Code "+res.statusCode);


					http.get("http://markets.ft.com/data/investment-trust/tearsheet/summary?s="+company.symbol, function(res){
						var html = '';
						debug && console.log('Response is '+res.statusCode);

						res.on('data', function (chunk) {
							debug && console.log("Loading...");
						    html += chunk;
						});

						res.on('end', function () {

							if(res.statusCode!=200){
								var location = res.headers['location']
								console.log(location);
								debug && console.log("STOP ACTION: Code "+res.statusCode);
								self.database.touchCompanyHistory(company, function(){
									callback && callback(true); return true; //Continue...
								});
								return;
							}

							env(html, function (errors, window) {
								var $ = require('jquery')(window);

								company.xid=JSON.parse($(".mod-tearsheet-add-to-portfolio").attr("data-mod-config")).xid;
								company.averageVolume=$(".mod-tearsheet-key-stats__extra .mod-ui-table").first().find("td").first().text();

								var marketCapTag=$($(".mod-tearsheet-key-stats__data__table:first tr")[1]).find("td");
								var marketCapHtml=marketCapTag.html();
								if(marketCapHtml){
									company.marketCap=marketCapHtml.substr(0,marketCapHtml.indexOf(" <span"));
								}else{
									company.marketCap=null;
								}

								self.database.updateCompany(company, function(){
									callback && callback(true); return true;
								});
							});
						});
				  	}).on('error', function (error) {
						console.log("Request error in http to company '"+company.bloombergId+"': "+error);
					    callback && callback(false); return;
					});

					callback && callback(false); return false;
				}else{

					env(html, function (errors, window) {
						var $ = require('jquery')(window);

						company.xid=JSON.parse($(".mod-tearsheet-add-to-portfolio").attr("data-mod-config")).xid;
						company.averageVolume=$(".mod-tearsheet-key-stats__extra .mod-ui-table").first().find("td").first().text();

						var marketCapTag=$("[data-lexicon-term='market capitalisation']").parent().siblings("td");
						var marketCapHtml=marketCapTag.html();
						if(marketCapHtml){
							company.marketCap=marketCapHtml.substr(0,marketCapHtml.indexOf(" <span"));
						}else{
							company.marketCap=null;
						}
						

						self.database.updateCompany(company, function(){
							callback && callback(true); return true;
						});
					});
				}
			});
	  	}).on('error', function (error) {
			console.log("Request error in http to company '"+company.bloombergId+"': "+error);
		    callback && callback(false); return;
		});
	}
};
/*
* Replace all occurrences for a string
* @param {string} search
* @param {string} replacement
*/
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};