var methods = {}
methods.ws = function () {
var db, db_pairs, db_5min, db_10min, db_15min, db_30min, db_1h, db_4h, db_24h

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/pairs', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_pairs = database.db("pairs")
})


mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_5min', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_5min = database.db("coinbase_historique_5min")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_10min', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_10min = database.db("coinbase_historique_10min")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_15min', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_15min = database.db("coinbase_historique_15min")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_30min', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_30min = database.db("coinbase_historique_30min")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_1h', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_1h = database.db("coinbase_historique_1h")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_4h', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_4h = database.db("coinbase_historique_4h")
})

mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds129560.mlab.com:29560/coinbase_historique_24h', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db_24h = database.db("coinbase_historique_24h")
})


mongodb.MongoClient.connect('mongodb://ortal:Ortal1234@ds123500.mlab.com:23500/coinbase_historique', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = database.db("coinbase_historique")
    console.log("in coinbase_historique")

    var arr=[] 

    db_pairs.collection("COINBASE_PAIRS")
    .find()
    .toArray(function (err, doc) {
        var my_pair_wsformat
        for (var i = 0; i < doc.length; i++) {
            my_pair_wsformat = doc[i].name.replace("_","-");
            arr.push(my_pair_wsformat)
        }

    var myobjet = new Object();
    var websocket = new CoinbaseExchange.WebsocketClient(arr);
    websocket.on('message', data => {
        
        if(data.type != 'subscriptions'){
            var my_pair = data.product_id.replace("-","_");
            var mydate = getMyDate(new Date());
            myobjet[my_pair] = {exchange:"COINBASE", price: data.price, date: mydate}
        }
    })

            //1 min
            var i = 0;
            setInterval(function () {
               for (property in myobjet) {
                date_now = new Date();
                my_historique_date = getMyDate(date_now);
                myobjet[property].date = my_historique_date;
                my_previous_date = get_1min_ago_Date(date_now);
                insertToDB(property,my_previous_date,myobjet)
                }
                i++;
                console.log("COI  i " + i + " date: " + my_historique_date.split(" ")[1])                
            }, 1000 * 60 * 1);

            //5 min
            var i_5 = 0;            
            setInterval(function () {
               for (property in myobjet) {
                date_now_5 = new Date();
                my_historique_date_5 = getMyDate(date_now_5);
                myobjet[property].date = my_historique_date_5;
                my_previous_date_5 = get_5min_ago_Date(date_now_5);
                insertToDB5min(property, my_previous_date_5, myobjet)
                }
                i_5++;
                console.log("COI  i_5 " + i_5 + " date: " + my_historique_date.split(" ")[1])
            },1000 * 60 * 5);

            //10 min
            var i_10 = 0;      
            setInterval(function () {
               for (property in myobjet) {
                date_now_10 = new Date();
                my_historique_date_10 = getMyDate(date_now_10);
                myobjet[property].date = my_historique_date_10;
                my_previous_date_10 = get_10min_ago_Date(date_now_10);
                insertToDB10min(property, my_previous_date_10, myobjet)
                }
                i_10++;
                console.log("COI  i_10 " + i_10 + " date: " + my_historique_date.split(" ")[1])
            }, 1000 * 60 * 10); 
            
             //15 min
             var i_15 = 0;      
             setInterval(function () {
                for (property in myobjet) {
                 date_now_15 = new Date();
                 my_historique_date_15 = getMyDate(date_now_15);
                 myobjet[property].date = my_historique_date_15;
                 my_previous_date_15 = get_15min_ago_Date(date_now_15);
                 insertToDB15min(property, my_previous_date_15, myobjet)
                 }
                 i_15++;
                 console.log("COI  i_15 " + i_15 + " date: " + my_historique_date.split(" ")[1])
            }, 1000 * 60 * 15);  

             //30 min
             var i_30 = 0;      
             setInterval(function () {
                for (property in myobjet) {
                 date_now_30 = new Date();
                 my_historique_date_30 = getMyDate(date_now_30);
                 myobjet[property].date = my_historique_date_30;
                 my_previous_date_30 = get_30min_ago_Date(date_now_30);
                 insertToDB30min(property, my_previous_date_30, myobjet)
                 }
                 i_30++;
                 console.log("COI  i_30 " + i_30 + " date: " + my_historique_date.split(" ")[1])
            }, 1000 * 60 * 30);  
            
             //1h
             var i_1h = 0;      
             setInterval(function () {
                for (property in myobjet) {
                 date_now_1h = new Date();
                 my_historique_date_1h = getMyDate(date_now_1h);
                 myobjet[property].date = my_historique_date_1h;
                 my_previous_date_1h = get_1h_ago_Date(date_now_1h);
                 insertToDB1h(property, my_previous_date_1h, myobjet)
                 }
                 i_1h++;
                 console.log("COI  i_1h " + i_1h + " date: " + my_historique_date.split(" ")[1])
            }, 1000 * 60 * 60);  

             //4h
             var i_4h = 0;      
             setInterval(function () {
                for (property in myobjet) {
                 date_now_4h = new Date();
                 my_historique_date_4h = getMyDate(date_now_4h);
                 myobjet[property].date = my_historique_date_4h;
                 my_previous_date_4h = get_4h_ago_Date(date_now_4h);
                 insertToDB4h(property, my_previous_date_4h, myobjet)
                 }
                 i_4h++;
                 console.log("COI  i_4h " + i_4h + " date: " + my_historique_date.split(" ")[1])
             }, 1000 * 60 * 60 * 4);  

             //24h
             var i_24h = 0;      
             setInterval(function () {
                for (property in myobjet) {
                 date_now_24h = new Date();
                 my_historique_date_24h = getMyDate(date_now_24h);
                 myobjet[property].date = my_historique_date_24h;
                 my_previous_date_24h = get_24h_ago_Date(date_now_24h);
                 insertToDB24h(property, my_previous_date_24h, myobjet)
                 }
                 i_24h++;
                 console.log("COI  i_24h " + i_24h + " date: " + my_historique_date.split(" ")[1])
             }, 1000 * 60 * 60 * 24);
  })
})

  

// 1min
function insertToDB(property,my_previous_date,myobjet){
    var object_to_send = {};
    db.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db.collection(property).insert(object_to_send)  
        }
        else{
            db.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {   
                    console.log("db_not equals*************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date)
                }
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db.collection(property).insert(object_to_send)
                
            });

            }
    });
}

// 5min
function insertToDB5min(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_5min.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_5min.collection(property).insert(object_to_send)  
        }
        else{
            db_5min.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_5min_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_5min.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 10min
function insertToDB10min(property, my_previous_date, myobjet){
    var object_to_send = {};
    db_10min.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_10min.collection(property).insert(object_to_send)  
        }
        else{
            db_10min.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_10min_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_10min.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 15min
function insertToDB15min(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_15min.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_15min.collection(property).insert(object_to_send)  
        }
        else{
            db_15min.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_15min_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_15min.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 30min
function insertToDB30min(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_30min.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_30min.collection(property).insert(object_to_send)  
        }
        else{
            db_30min.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_30min_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_30min.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 1h
function insertToDB1h(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_1h.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_1h.collection(property).insert(object_to_send)  
        }
        else{
            db_1h.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_1h_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_1h.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 4h
function insertToDB4h(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_4h.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_4h.collection(property).insert(object_to_send)  
        }
        else{
            db_4h.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_4h_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_4h.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}

// 24h
function insertToDB24h(property,my_previous_date,myobjet){
    var object_to_send = {};
    db_24h.collection(property).count(function (err, count) {
        if (!err && count === 0) {
            for (property2 in myobjet[property])
            { object_to_send[property2] = myobjet[property][property2] }
            db_24h.collection(property).insert(object_to_send)  
        }
        else{
            db_24h.collection(property).find().sort({_id:-1}).limit(1).toArray(function(err, result) { 
                if (err) throw err;
                var the_last_date = result[0].date
                if (the_last_date != my_previous_date)
                {  
                    console.log("db_24h_not equals**************last_date_in_table " + the_last_date + " my_previous_date " + my_previous_date) 
                }
               
                for (property2 in myobjet[property])
                { object_to_send[property2] = myobjet[property][property2] }
                db_24h.collection(property).insert(object_to_send)
                
            });
            
        }
    });
}


function getMyDate(dateObj)
{ var year = dateObj.getFullYear();
  var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  var day = ('0' + dateObj.getDate()).slice(-2);
  var shortDate = year + '-' + month + '-' + day;
  var Hours = dateObj.getHours()
  var Minutes = ('0' + dateObj.getMinutes()).slice(-2);
  var Seconde = dateObj.getSeconds();
  var shortTime = Hours + ':' + Minutes + ':00'
  var my_Final_Date = shortDate + ' ' + shortTime
  return my_Final_Date
}


function get_1min_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 1 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_5min_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 5 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_10min_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 10 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_15min_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 15 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_30min_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 30 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_1h_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var myPreviousDate = new Date(dateObj - 60 * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_4h_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var temp = 60 * 4
    var myPreviousDate = new Date(dateObj - temp * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}

function get_24h_ago_Date(dateObj)
{ 
    var MS_PER_MINUTE = 60000;
    var temp = 60 * 24
    var myPreviousDate = new Date(dateObj - temp * MS_PER_MINUTE);
    myPreviousDate = getMyDate(myPreviousDate)
    return myPreviousDate
}


}
exports.data = methods;