var csv = require("fast-csv");
var fs=require("fs");

module.exports = {
	getCompanyInfo: function (symbol, callback) {
		var self=this;
		self.database.getCompany(symbol,function(company){
			if(!company){
				callback(false, "No company found..."); return;
			}

			msg="Name;Symbol;Index ID;Sector;Subsector;Market capital;currency;Avg. volume;#Directives;#Countries;Field created at;Field updated at\n";
			msg+=company.name+";"+
			company.symbol+";"+
			company.indexId+";"+
			self.standarizedForCsv(company.sector)+";"+
			self.standarizedForCsv(company.subsector)+";"+
			company.marketCap+";"+
			company.currency+";"+
			company.averageVolume+";"+
			Object.keys(company.directives).length+";"+
			Object.keys(company.countryList).length+";"+
			self.getDateWithFormat(company.createdAt)+";"+
			self.getDateWithFormat(company.updatedAt)+"\n";

			callback(true, msg); return;

			
			return;
		});
		return;
	},
	getIndexes: function (callback) {
		var self=this;
		self.database.getIndexes(function(indexes){
			if(!indexes){
				callback(false, "No index found..."); return;
			}

			msg="Index ID;Members count;Field updated at\n";
			for(var i=0;i<indexes.length;i++){
				index=indexes[i];
				msg+=index.indexId+";"+index.membersCount+";"+self.getDateWithFormat(index.updatedAt)+"\n"
			}

			callback(true, msg); return;
		});
		return;
	},
	getCompanies: function (callback) {
		var self=this;
		self.database.getCompanies(function(companies){
			if(!companies){
				callback(false, "No company found..."); return;
			}

			msg="Name;Symbol;Index ID;Sector;Subsector;Market capital;currency;Avg. volume;#Directives;#Countries;Field created at;Field updated at\n";
			for(var i=0;i<companies.length;i++){
				company=companies[i];
				msg+=company.name+";"+
				company.symbol+";"+
				company.indexId+";"+
				self.standarizedForCsv(company.sector)+";"+
				self.standarizedForCsv(company.subsector)+";"+
				company.marketCap+";"+
				company.currency+";"+
				company.averageVolume+";"+
				Object.keys(company.directives).length+";"+
				Object.keys(company.countryList).length+";"+
				self.getDateWithFormat(company.createdAt)+";"+
				self.getDateWithFormat(company.updatedAt)+"\n";
			}

			callback(true, msg); return;
		});
		return;
	},
	getDirectives: function (callback) {
		var self=this;
		self.database.getCompanies(function(companies){
			if(!companies){
				callback(false, "No company found..."); return;
			}

			msg="Company name;Company symbol;Index ID;Name;Title;Field created at;Field updated at\n";
			for(var i=0;i<companies.length;i++){
				company=companies[i];

				for(var j=0;j<Object.keys(company.directives).length;j++){
					var name=self.standarizedForCsv(company.directives[j].name);
					var title=self.standarizedForCsv(company.directives[j].title);

					var indexOf=name.indexOf(" - ");
					if(indexOf>0){
						title=name.substr(indexOf+3);
						name=name.substr(0,indexOf);
					}

					msg+=company.name+";"+
					company.symbol+";"+
					company.indexId+";"+
					name+";"+
					title+";"+
					self.getDateWithFormat(company.createdAt)+";"+
					self.getDateWithFormat(company.updatedAt)+"\n";
				}
			}

			callback(true, msg); return;
		});
		return;
	},
	getCompanyInCountries: function (callback) {
		var self=this;
		self.database.getCompanies(function(companies){
			if(!companies){
				callback(false, "No company found..."); return;
			}

			msg="Company name;Country;Symbol;Market\n";
			for(var i=0;i<companies.length;i++){
				company=companies[i];
				countries=Object.keys(company.countryList);

				for(var j=0;j<countries.length;j++){
					var country=countries[j];
					var symbols=Object.keys(company.countryList[country]);
					for(var k=0; k<symbols.length; k++){
						var symbolEntry=symbols[k];
						msg+=company.name+";"+
						country+";"+
						company.countryList[country][symbolEntry].symbol+";"+
						company.countryList[country][symbolEntry].market+"\n";
					}
				}
			}

			callback(true, msg); return;
		});
		return;
	},
	getHistories: function (callback) {
		var self=this;
		self.database.getHistories(function(histories){
			if(!histories){
				callback(false, "No company found..."); return;
			}

			msg="Symbol;Currency;Date;Open\n"; //;High;Low;Close;Volume
			for(var i=0;i<histories.length;i++){
				history=histories[i];
				//console.log(Math.round(i/histories.length*100)+"%");

				var historicalValues=Object.keys(history.historicalValues);
				for(var j=0; j<historicalValues.length; j++){
					var entry=history.historicalValues[historicalValues[j]];
					msg+=history.symbol+";"+
					history.currency+";"+
					self.getDateWithFormat(entry.date)+";"+
					entry.open.replaceAll(",","")+"\n";
					//entry.high.replaceAll(",","")+";"+
					//entry.low.replaceAll(",","")+";"+
					//entry.close.replaceAll(",","")+";"+
					//entry.volume.replaceAll(",","")+"\n";
				}
			}

			callback(true, msg); return;
		});
		return;

	},
	getHistoryMatrix: function (offset, callback) {
		var self=this;
		console.log("Getting history");

		/*if(offset==10){
			callback && callback(false); return;
		}*/

		//write header
		console.log("Starting loop");

		var datesMatrix=getDatesInInterval(new Date().addDays(-5*366), new Date());

		if(offset==0){
			fs.writeFile("./files/history-matrix.csv",self.getDatesCSV(datesMatrix));
		}

		self.database.history.find().limit(1).skip(offset).toArray(function(err, docs){
        	if(!docs || docs.length==0){
				console.log("No doc...", docs, "Err?:",err);
			    //close file
				callback && callback(false); return;
			}else{

				var history=docs[0];
				var thisVector=[];

				if(!history){
					callback && callback(true); return;
				}		

				var thisDates=Object.keys(history.historicalValues);

				for(var j=0; j<thisDates.length;j++){
					var date2Find=new Date(thisDates[j]);
					for(var i=3; i<datesMatrix.length;i++){
					 // console.log("Date[i]",datesMatrix[i],date2Find,datesMatrix[i].dayEquals(date2Find))
					  if(datesMatrix[i].dayEquals(date2Find)){
					    //console.log("Found!",i);
					    thisVector[i]=(history.historicalValues[thisDates[j]]);
					    break;
					  }
					}
					if(i==datesMatrix.length){
						console.log("ERROR, date not found:",date2Find);
						thisVector[i]=null;
					}
				}
				if(thisVector.length>0){
					console.log("RES! "+history.symbol);
					thisVector[0]=history.symbol;		
					thisVector[1]=history.companyName;
					thisVector[2]=history.currency;	
					//Write to file
					fs.appendFile("./files/history-matrix.csv",self.getCSV(thisVector));
				}
				callback && callback(true); return;
			}	
	    });
	},
	getDateWithFormat:function(date){
		if(date==null||date==undefined){
			return "";
		}
		return date.getUTCFullYear()+"-"+(date.getUTCMonth()+1)+"-"+date.getUTCDate();
	},
	standarizedForCsv: function(string){
		if(string==null||string==undefined){
			return "";
		}
		return string.replaceAll(";","").replaceAll("\t"," ").replaceAll("&amp;","&").replaceAll("--","-");
	},
	getCSV: function(array){
		var result='';
		for(var i=0; i<array.length; i++){
			if(array[i]){
				if(i==array.length-1){
					result+='"'+array[i]+'"\n'
				}else{
					result+='"'+array[i]+'",'
				}
			}else{
				result+=','
			}
		}
		return result;
	},
	getDatesCSV: function(array){
		var result='';

		var weekday = new Array(7);
		weekday[0]=  "Domingo";
		weekday[1] = "Lunes";
		weekday[2] = "Martes";
		weekday[3] = "Miercoles";
		weekday[4] = "Jueves";
		weekday[5] = "Viernes";
		weekday[6] = "Sabado";

		for(var i=0; i<array.length; i++){
			if(i>2){
				var data=weekday[array[i].getDay()]+" "+array[i].getDate()+"-"+array[i].getMonth()+"-"+array[i].getFullYear();
			}else{
				var data=array[i];
			}
			if(data){
				if(i==array.length-1){
					result+='"'+data+'"\n'
				}else{
					result+='"'+data+'",'
				}
			}else{
				result+=','
			}
		}
		return result;
	}
}
/*
* Replace all occurrences for a string
* @param {string} search
* @param {string} replacement
*/
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
/*
* Returns true if a char exist 
* @param {string} search
*/
String.prototype.contains= function(search) {
    var target = this;
    return (target.indexOf(search)>0);
};
/*
* Add days to a date 
* @param {date} days
*/
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}
/*
* like equals, but only considering the day
* @param {date} days
*/
Date.prototype.dayEquals = function(date) {
    var dat = new Date(this.valueOf());
    if(date.getFullYear()==dat.getFullYear()&&date.getDate()==dat.getDate()&&date.getMonth()==dat.getMonth()){
    	//console.log("Equivalence",date,dat);
    	return true;
    }
    return false;
}
/*
* Returns array qith all dates between the two given dates 
* @param {date} startDate
* @param {date} stopDate
*/
function getDatesInInterval(startDate, stopDate) {
	//console.log("init",startDate,"end",stopDate);
    var dateArray = new Array();

    dateArray.push("Symbol");
    dateArray.push("Company Name");
    dateArray.push("Currency");

    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}