(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "week_id"  , dataType: tableau.dataTypeEnum.string},
            {id: "week_num" , dataType: tableau.dataTypeEnum.float},
            {id: "game_id"  , dataType: tableau.dataTypeEnum.string},
            {id: "scheduled", dataType: tableau.dataTypeEnum.string},
            {id: "home_team", dataType: tableau.dataTypeEnum.string},
            {id: "away_team", dataType: tableau.dataTypeEnum.string}
        ];

        var tableSchema = {
            id: "Sports_Feed",
            alias: "Something Something Sports ",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };



    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://api.sportradar.us/ncaafb-b1/2018/REG/schedule.json?api_key=usevcuzc3r7tcbsezpsn2jaa", function(resp) {
        //This fils is connecting to the JSON my other folder!!!!
        $.getJSON("https://rlanigan.github.io/WebDataConnectors/JSON-test/sports.json", function(resp) {
            /*
                This is where you will change what you are targeting, and what you are iterating over
                resp."name ov array you want to iterate on"
                If there are sub arrays (particular games within a particular week) then you will need a nested for loop
            */
            var feat = resp.weeks, tableData = [];

            // Iterate over the JSON object
            for (var i = 0, week_count = feat.length; i < week_count; i++) {
                for (var n = 0, game_count = feat[i].games.length; n < game_count; n++) {
                    console.log("week_id", feat[i].id, "week_num", feat[i].number);
                    console.log("     ", "game_id", feat[i].games[n].id, "home_team", feat[i].games[n].home, "away_team", feat[i].games[n].away);
                    
                    tableData.push({
                        "week_id"   : feat[i].id,
                        "week_num"  : feat[i].number,
                        "game_id"   : feat[i].games[n].id,
                        "scheduled" : feat[i].games[n].scheduled,
                        "home_team" : feat[i].games[n].home,
                        "away_team" : feat[i].games[n].away
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