Loader = {
    register: function (collection){
        var data = Loader.import_data[collection._name];
        if(collection.find().fetch({}).length == 0){
            for(var i in data){
                for(var property in data[i]){

                    if(typeof data[i][property] == "function"){
                        data[i][property] = data[i][property]();
                    }
                }
                collection.insert(data[i]);
            }
        }
    },
    clear: function (collection){
        items = collection.find().fetch({});
        for(i in items){ 
            collection.remove({_id:items[i]._id});
        }
    },
    setData: function (data){
        Loader.import_data = data;
    },
    import_data: {}
    
}