(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "week_id", dataType: tableau.dataTypeEnum.string},
            {id: "week_num", dataType: tableau.dataTypeEnum.float},
            {id: "game_id", dataType: tableau.dataTypeEnum.string},
            {id: "home_team", dataType: tableau.dataTypeEnum.string}
        ];

        var tableSchema = {
            id: "Sports_Feed",
            alias: "Something Something Sports ",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };



    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.sportradar.us/ncaafb-b1/2018/REG/schedule.json?api_key=usevcuzc3r7tcbsezpsn2jaa", function(resp) {
            /*
                This is where you will change what you are targeting, and what you are iterating over
                resp."name ov array you want to iterate on"
                If there are sub arrays (particular games within a particular week) then you will need a nested for loop
            */
            var feat = resp.weeks,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                for (var j = 0, len = feat[i].games.length; j < len; j++) {
                    tableData.push({
                        "week_id": feat[i].id,
                        "week_num": feat[i].number,
                        "game_id": feat[i].games[j].id,
                        "home_team": feat[i].games[j].home
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
            tableau.connectionName = "USGS Earthquake Feed";
            tableau.submit();
        });
    });
})();