(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = 
        [
            {id: "id", dataType: tableau.dataTypeEnum.string}, 
            {id: "mag", alias: "magnitude", dataType: tableau.dataTypeEnum.float}, 
            {id: "title", alias: "title", dataType: tableau.dataTypeEnum.string}, 
            {id: "location", dataType: tableau.dataTypeEnum.geometry},
            {id: "place", dataType: tableau.dataTypeEnum.string},
            {id: "url", dataType: tableau.dataTypeEnum.string}
        ];

        var tableSchema = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "mag": feat[i].properties.mag,
                    "title": feat[i].properties.title,
                    "location": feat[i].geometry,
                    "place": feat[i].properties.place,
                    "url": feat[i].properties.url
                });
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