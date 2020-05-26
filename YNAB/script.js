
(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "account_name"   , dataType: tableau.dataTypeEnum.string},
            {id: "payee_name"     , dataType: tableau.dataTypeEnum.string},

            {id: "category_id"    , dataType: tableau.dataTypeEnum.string},
            {id: "category_name"  , dataType: tableau.dataTypeEnum.int},

            {id: "transaction_id" , dataType: tableau.dataTypeEnum.string},
            {id: "date"           , dataType: tableau.dataTypeEnum.string},
            {id: "amount"         , dataType: tableau.dataTypeEnum.float}      
        ];

        var tableSchema = {
            id: "YNAB_Feed",
            alias: "Transaction Table",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };



    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.youneedabudget.com/v1/budgets/cf8bc472-2059-4c3c-881d-b373329b6450/transactions", function(resp) {
            var feat = resp.weeks, tableData = [];

            // Iterate over the JSON object
            for (var i = 0, week_count = feat.length; i < week_count; i++) {
                for (var n = 0, game_count = feat[i].games.length; n < game_count; n++) {
                    

                    tableData.push({
                        "week_id"       : feat[i].id,
                        "week_num"      : feat[i].number,
                        "game_id"       : feat[i].games[n].id,
                        "scheduled"     : feat[i].games[n].scheduled,
                        
                        "home_team"     : feat[i].games[n].home,
                        "home_score"    : feat[i].games[n].home_points,
                        "away_team"     : feat[i].games[n].away,
                        "away_score"    : feat[i].games[n].away_points,

                        "venue_name"    : feat[i].games[n].venue.name,                         
                        "state"         : feat[i].games[n].venue.state,
                        "city"          : feat[i].games[n].venue.city,
                        "zip"           : feat[i].games[n].venue.zip
                    });
                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    
    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Sports Data Feed";
            tableau.submit();
        });
    });
})();