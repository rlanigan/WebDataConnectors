
(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            {id: "transaction_id" , dataType: tableau.dataTypeEnum.string},
            {id: "date"           , dataType: tableau.dataTypeEnum.string},
            {id: "amount"         , dataType: tableau.dataTypeEnum.float},

            {id: "account_name"   , dataType: tableau.dataTypeEnum.string},
            {id: "payee_name"     , dataType: tableau.dataTypeEnum.string},

            {id: "category_id"    , dataType: tableau.dataTypeEnum.string},
            {id: "category_name"  , dataType: tableau.dataTypeEnum.string}
        ];

        var tableSchema = {
            id: "YNAB_Feed",
            alias: "Transaction Table",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };



    myConnector.getData = function(table, doneCallback) {
        $.ajaxSetup({
            headers : {
                'Authorization': 'Bearer 797b0f9410da373cb5acb84751cb289475c269fe521c8d365c0bdc7727e9309a',
                'X-PartnerKey' : '3252352-sdgds-sdgd-dsgs-sgs332fs3f'
            }
        });
        $.getJSON("https://api.youneedabudget.com/v1/budgets/cf8bc472-2059-4c3c-881d-b373329b6450/transactions?since_date=2020-05-20", function(resp) {
            var feat = resp.data.transactions, tableData = [];

            // Iterate over the JSON object
            for (var i = 0, count = feat.length; i < count; i++) {
//                for (var n = 0, game_count = feat[i].games.length; n < game_count; n++) {
                    

                    tableData.push({
                        "transaction_id"    : feat[i].id,
                        "date"              : feat[i].date,
                        "amount"            : feat[i].amount,

                        "account_name"      : feat[i].account_name,
                        "payee_name"        : feat[i].payee_name,
                        
                        "category_id"       : feat[i].category_id,
                        "category_name"     : feat[i].category_name
                    });
//                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    
    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Finance Data Feed";
            tableau.submit();
        });
    });
})();